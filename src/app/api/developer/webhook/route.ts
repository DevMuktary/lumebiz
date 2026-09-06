import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateWebhookSecret } from "@/lib/developer/keys";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { webhookConfig: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.webhookConfig) {
      return NextResponse.json({ success: true, data: null });
    }

    const config = user.webhookConfig;
    const maskedSecret =
      config.secretKey.length > 10
        ? `${config.secretKey.slice(0, 8)}••••••••${config.secretKey.slice(-4)}`
        : config.secretKey;

    return NextResponse.json({
      success: true,
      data: {
        id: config.id,
        url: config.url,
        secretKey: config.secretKey, // Included for developer to copy into their backend
        maskedSecret,
        isActive: config.isActive,
        updatedAt: config.updatedAt,
      },
    });
  } catch (err) {
    console.error("❌ [Developer Webhook GET] Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, isActive = true, rotateSecret = false } = body;

    if (!url || typeof url !== "string" || (!url.startsWith("http://") && !url.startsWith("https://"))) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid URL starting with https:// (or http:// for local testing)." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { webhookConfig: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let secretKey = user.webhookConfig?.secretKey;
    if (!secretKey || rotateSecret) {
      secretKey = generateWebhookSecret();
    }

    const updatedConfig = await prisma.webhookConfig.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        url: url.trim(),
        secretKey,
        isActive: Boolean(isActive),
      },
      update: {
        url: url.trim(),
        secretKey,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Webhook configuration saved successfully.",
      data: {
        url: updatedConfig.url,
        secretKey: updatedConfig.secretKey,
        isActive: updatedConfig.isActive,
      },
    });
  } catch (err) {
    console.error("❌ [Developer Webhook POST] Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
