import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { webhookConfig: true },
    });

    if (!user || !user.webhookConfig || !user.webhookConfig.url) {
      return NextResponse.json(
        { success: false, message: "No active webhook URL configured. Please save a webhook URL first." },
        { status: 400 }
      );
    }

    const { url, secretKey } = user.webhookConfig;
    const testPayload = {
      event: "webhook.test_ping",
      timestamp: new Date().toISOString(),
      developer: {
        userId: user.id,
        email: user.email,
      },
      message: "Hello from Lorabiz Developer Platform! Webhook connection verified successfully.",
    };

    const payloadString = JSON.stringify(testPayload);
    const signature = crypto.createHmac("sha256", secretKey).update(payloadString).digest("hex");

    const startTime = Date.now();
    let responseStatus = 0;
    let responseText = "";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Lorabiz-Webhook-Bot/1.0",
          "X-Lorabiz-Signature": `sha256=${signature}`,
          "X-Lorabiz-Event": "webhook.test_ping",
        },
        body: payloadString,
        signal: AbortSignal.timeout(8000), // 8-second timeout
      });

      responseStatus = response.status;
      responseText = await response.text();
    } catch (networkErr: any) {
      const latencyMs = Date.now() - startTime;
      return NextResponse.json({
        success: false,
        message: `Failed to reach webhook endpoint: ${networkErr.message || "Connection timed out"}`,
        latencyMs,
      }, { status: 502 });
    }

    const latencyMs = Date.now() - startTime;
    const isSuccess = responseStatus >= 200 && responseStatus < 300;

    return NextResponse.json({
      success: isSuccess,
      message: isSuccess
        ? `Webhook endpoint responded with HTTP ${responseStatus} OK in ${latencyMs}ms.`
        : `Webhook endpoint responded with HTTP ${responseStatus} Error in ${latencyMs}ms.`,
      statusCode: responseStatus,
      latencyMs,
      responseSnippet: responseText.slice(0, 200),
    });
  } catch (err) {
    console.error("❌ [Developer Webhook Test POST] Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
