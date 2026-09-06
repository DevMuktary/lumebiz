import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: true,
        developerProfile: true,
        webhookConfig: true,
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Start of today (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [todayLogsCount, successfulLogsCount, latencyAggregate, keyCounts] = await Promise.all([
      prisma.apiRequestLog.count({
        where: { userId: user.id, createdAt: { gte: today } },
      }),
      prisma.apiRequestLog.count({
        where: {
          userId: user.id,
          createdAt: { gte: today },
          statusCode: { gte: 200, lt: 300 },
        },
      }),
      prisma.apiRequestLog.aggregate({
        where: { userId: user.id, createdAt: { gte: today } },
        _avg: { latencyMs: true },
      }),
      prisma.apiKey.groupBy({
        by: ["type"],
        where: { userId: user.id, status: "ACTIVE" },
        _count: { _all: true },
      }),
    ]);

    const liveKeysCount = keyCounts.find((k) => k.type === "LIVE")?._count._all || 0;
    const testKeysCount = keyCounts.find((k) => k.type === "TEST")?._count._all || 0;

    const successRate =
      todayLogsCount > 0 ? ((successfulLogsCount / todayLogsCount) * 100).toFixed(1) : "100.0";
    const avgLatency = Math.round(latencyAggregate._avg.latencyMs || 0);

    return NextResponse.json({
      success: true,
      data: {
        walletBalance: Number(user.wallet?.balance || 0),
        sandboxBalance: Number(user.sandboxBalance || 1000000),
        totalCallsToday: todayLogsCount,
        successRate: parseFloat(successRate),
        avgLatencyMs: avgLatency,
        liveKeysCount,
        testKeysCount,
        developerProfile: user.developerProfile
          ? {
              status: user.developerProfile.status,
              businessName: user.developerProfile.businessName,
              rejectionReason: user.developerProfile.rejectionReason,
              approvedAt: user.developerProfile.approvedAt,
            }
          : null,
        hasWebhook: !!user.webhookConfig?.isActive,
      },
    });
  } catch (err) {
    console.error("❌ [Developer Overview API] Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
