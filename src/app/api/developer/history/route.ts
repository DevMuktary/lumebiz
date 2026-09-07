import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export interface UnifiedServiceItem {
  id: string;
  service: "NIN_SLIP" | "NIN_IPE" | "NIN_PERSONALIZATION" | "NIN_VALIDATION" | "BVN_VERIFY";
  serviceLabel: string;
  identifier: string; // Masked NIN, BVN, or Tracking ID
  reference: string;
  status: "SUCCESS" | "PROCESSING" | "FAILED";
  amount: number;
  fullName: string | null;
  createdAt: string;
  pdfUrl: string | null;
  failureReason: string | null;
  details?: Record<string, any>;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const serviceFilter = searchParams.get("service") || "ALL"; // ALL, NIN_SLIP, NIN_IPE, NIN_PERSONALIZATION, NIN_VALIDATION, BVN_VERIFY
    const statusFilter = searchParams.get("status") || "ALL"; // ALL, SUCCESS, PROCESSING, FAILED
    const query = searchParams.get("query")?.trim().toLowerCase() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const promises: Promise<UnifiedServiceItem[]>[] = [];

    // 1. NIN Slips & Lookups
    if (serviceFilter === "ALL" || serviceFilter === "NIN_SLIP") {
      promises.push(
        prisma.ninRequestLog
          .findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
          })
          .then((records) =>
            records.map((r) => {
              const statusNormalized =
                r.status.toUpperCase() === "SUCCESS"
                  ? "SUCCESS"
                  : r.status.toUpperCase() === "FAILED"
                  ? "FAILED"
                  : "PROCESSING";

              const slipLabel =
                r.slipType === "nin_premium"
                  ? "NIN Premium Slip"
                  : r.slipType === "nin_standard"
                  ? "NIN Standard Slip"
                  : r.slipType === "nin_regular"
                  ? "NIN Regular Slip"
                  : `NIN Lookup (${r.slipType || "Basic"})`;

              return {
                id: r.id,
                service: "NIN_SLIP" as const,
                serviceLabel: slipLabel,
                identifier: r.ninMasked || "N/A",
                reference: r.reference,
                status: statusNormalized as "SUCCESS" | "PROCESSING" | "FAILED",
                amount: Number(r.amountCharged),
                fullName: r.fullName || null,
                createdAt: r.createdAt.toISOString(),
                pdfUrl: r.pdfUrl || null,
                failureReason: statusNormalized === "FAILED" ? "Verification lookup failed" : null,
                details: {
                  searchType: r.searchType,
                  provider: r.providerUsed,
                  gender: r.gender,
                  dob: r.dob,
                  phone: r.phone,
                },
              };
            })
          )
      );
    }

    // 2. NIN IPE Clearances
    if (serviceFilter === "ALL" || serviceFilter === "NIN_IPE") {
      promises.push(
        prisma.ninIpeRequest
          .findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
          })
          .then((records) =>
            records.map((r) => {
              const statusNormalized =
                r.status === "COMPLETED"
                  ? "SUCCESS"
                  : r.status === "FAILED"
                  ? "FAILED"
                  : "PROCESSING";

              return {
                id: r.id,
                service: "NIN_IPE" as const,
                serviceLabel: "NIN IPE Clearance",
                identifier: r.trackingId || r.resolvedNin || "N/A",
                reference: r.reference,
                status: statusNormalized as "SUCCESS" | "PROCESSING" | "FAILED",
                amount: Number(r.amountCharged),
                fullName: r.fullName || null,
                createdAt: r.createdAt.toISOString(),
                pdfUrl: null,
                failureReason: r.failureReason || null,
                details: {
                  trackingId: r.trackingId,
                  resolvedNin: r.resolvedNin,
                  provider: r.provider,
                  dob: r.dob,
                  gender: r.gender,
                  apiMessage: r.apiMessage,
                },
              };
            })
          )
      );
    }

    // 3. NIN Personalization Requests
    if (serviceFilter === "ALL" || serviceFilter === "NIN_PERSONALIZATION") {
      promises.push(
        prisma.ninPersonalizationRequest
          .findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
          })
          .then((records) =>
            records.map((r) => {
              const statusNormalized =
                r.status === "COMPLETED"
                  ? "SUCCESS"
                  : r.status === "FAILED"
                  ? "FAILED"
                  : "PROCESSING";

              return {
                id: r.id,
                service: "NIN_PERSONALIZATION" as const,
                serviceLabel: "NIN Personalization",
                identifier: r.trackingId || r.resolvedNin || "N/A",
                reference: r.reference,
                status: statusNormalized as "SUCCESS" | "PROCESSING" | "FAILED",
                amount: Number(r.amountCharged),
                fullName: r.fullName || null,
                createdAt: r.createdAt.toISOString(),
                pdfUrl: r.pdfUrl || null,
                failureReason: r.failureReason || null,
                details: {
                  trackingId: r.trackingId,
                  resolvedNin: r.resolvedNin,
                  provider: r.provider,
                  phone: r.phone,
                  state: r.residenceState,
                  apiMessage: r.apiMessage,
                },
              };
            })
          )
      );
    }

    // 4. NIN Validation Requests
    if (serviceFilter === "ALL" || serviceFilter === "NIN_VALIDATION") {
      promises.push(
        prisma.ninValidationRequest
          .findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
          })
          .then((records) =>
            records.map((r) => {
              const statusNormalized =
                r.status === "COMPLETED"
                  ? "SUCCESS"
                  : r.status === "FAILED"
                  ? "FAILED"
                  : "PROCESSING";

              return {
                id: r.id,
                service: "NIN_VALIDATION" as const,
                serviceLabel: `NIN Validation (${r.category})`,
                identifier: r.nin ? `${r.nin.slice(0, 3)}*****${r.nin.slice(-3)}` : "N/A",
                reference: r.transactionRef,
                status: statusNormalized as "SUCCESS" | "PROCESSING" | "FAILED",
                amount: Number(r.amountCharged),
                fullName: null,
                createdAt: r.createdAt.toISOString(),
                pdfUrl: null,
                failureReason: r.failureReason || null,
                details: {
                  category: r.category,
                  provider: r.provider,
                  apiMessage: r.apiMessage,
                },
              };
            })
          )
      );
    }

    // 5. BVN Verifications
    if (serviceFilter === "ALL" || serviceFilter === "BVN_VERIFY") {
      promises.push(
        prisma.bvnRequestLog
          .findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
          })
          .then((records) =>
            records.map((r) => {
              const statusNormalized =
                r.status.toUpperCase() === "SUCCESS"
                  ? "SUCCESS"
                  : r.status.toUpperCase() === "FAILED"
                  ? "FAILED"
                  : "PROCESSING";

              return {
                id: r.id,
                service: "BVN_VERIFY" as const,
                serviceLabel:
                  r.slipType === "bvn_premium"
                    ? "BVN Premium Slip"
                    : r.slipType === "bvn_standard"
                    ? "BVN Standard Slip"
                    : "BVN KYC Verification",
                identifier: r.bvnMasked || "N/A",
                reference: r.reference,
                status: statusNormalized as "SUCCESS" | "PROCESSING" | "FAILED",
                amount: Number(r.amountCharged),
                fullName: r.fullName || null,
                createdAt: r.createdAt.toISOString(),
                pdfUrl: r.pdfUrl || null,
                failureReason: statusNormalized === "FAILED" ? "BVN verification lookup failed" : null,
                details: {
                  provider: r.providerUsed,
                  gender: r.gender,
                  dob: r.dob,
                  phone: r.phone,
                },
              };
            })
          )
      );
    }

    // Await all parallel queries
    const resultsArrays = await Promise.all(promises);
    let unified = resultsArrays.flat();

    // Sort globally by createdAt descending
    unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply Status Filter if not ALL
    if (statusFilter !== "ALL") {
      unified = unified.filter((item) => item.status === statusFilter);
    }

    // Apply Search Query if provided
    if (query) {
      unified = unified.filter(
        (item) =>
          item.reference.toLowerCase().includes(query) ||
          item.identifier.toLowerCase().includes(query) ||
          (item.fullName && item.fullName.toLowerCase().includes(query)) ||
          item.serviceLabel.toLowerCase().includes(query)
      );
    }

    // Apply overall slice limit
    const paged = unified.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        items: paged,
        total: unified.length,
      },
    });
  } catch (error: any) {
    console.error("[API_DEVELOPER_HISTORY_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error fetching service history" },
      { status: 500 }
    );
  }
}
