"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Tag, CheckCircle2, ShieldCheck, Zap, Info } from "lucide-react";

export default function DeveloperPricingPage() {
  const identityServices = [
    {
      service: "NIN Verification by 11-digit NIN",
      endpoint: "POST /v1/nin/by-nin",
      slip: "Basic Demographic Lookup",
      wholesalePrice: "₦100.00",
      retailPrice: "₦200.00",
      savings: "50%",
      speed: "< 600ms",
    },
    {
      service: "NIN Verification by 11-digit NIN",
      endpoint: "POST /v1/nin/by-nin",
      slip: "Virtual NIN (vNIN) Slip (PDF)",
      wholesalePrice: "₦120.00",
      retailPrice: "₦250.00",
      savings: "52%",
      speed: "< 800ms",
    },
    {
      service: "NIN Verification by 11-digit NIN",
      endpoint: "POST /v1/nin/by-nin",
      slip: "Regular Slip (PDF)",
      wholesalePrice: "₦150.00",
      retailPrice: "₦300.00",
      savings: "50%",
      speed: "< 800ms",
    },
    {
      service: "NIN Verification by 11-digit NIN",
      endpoint: "POST /v1/nin/by-nin",
      slip: "Standard KYC Slip (PDF)",
      wholesalePrice: "₦200.00",
      retailPrice: "₦350.00",
      savings: "43%",
      speed: "< 800ms",
    },
    {
      service: "NIN Verification by 11-digit NIN",
      endpoint: "POST /v1/nin/by-nin",
      slip: "Premium Card Slip (PDF)",
      wholesalePrice: "₦250.00",
      retailPrice: "₦450.00",
      savings: "44%",
      speed: "< 800ms",
    },
    {
      service: "NIN Verification by Phone Number",
      endpoint: "POST /v1/nin/by-phone",
      slip: "Regular / Standard / Premium (PDF)",
      wholesalePrice: "₦300.00",
      retailPrice: "₦500.00",
      savings: "40%",
      speed: "< 1,200ms",
    },
    {
      service: "BVN Verification & Demographics",
      endpoint: "POST /v1/bvn/verify",
      slip: "Full Demographic & KYC Match",
      wholesalePrice: "₦150.00",
      retailPrice: "₦300.00",
      savings: "50%",
      speed: "< 600ms",
    },
  ];

  const clearanceServices = [
    {
      service: "NIN IPE Clearance",
      endpoint: "POST /v1/nin/ipe",
      description: "Resolution of NIMC Initial Processing Exception (IPE) via Tracking ID",
      wholesalePrice: "₦2,500.00",
      retailPrice: "₦3,500.00",
      turnaround: "1–24 Hours",
    },
    {
      service: "NIN Validation",
      endpoint: "POST /v1/nin/validation",
      description: "Validation of NIN records following modification or search sync",
      wholesalePrice: "₦1,500.00",
      retailPrice: "₦2,000.00",
      turnaround: "1–24 Hours",
    },
    {
      service: "NIN Personalization",
      endpoint: "POST /v1/nin/personalization",
      description: "Processing & retrieval of NINs interrupted by network drops",
      wholesalePrice: "₦1,500.00",
      retailPrice: "₦2,000.00",
      turnaround: "1–24 Hours",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/dashboard/developer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Developer Hub</span>
        </Link>
      </div>

      {/* Hero Title */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5 text-emerald-500">
            <Tag className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              API Wholesale Pricing
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Discounted B2B wholesale rates for verified developers, agencies, and high-volume platforms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/wallet"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Fund Wallet
          </Link>
          <Link
            href="/docs"
            target="_blank"
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            View Docs
          </Link>
        </div>
      </div>

      {/* Value Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Zero-Risk Billing Policy</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Failed client queries (4xx errors) are charged <strong>₦0.00</strong>. You are only debited upon successful fulfillment.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
          <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500 shrink-0">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">₦1,000,000 Sandbox Credit</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Test Mode queries deduct from your virtual sandbox balance. Build and test freely without spending real money.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
          <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Automated Atomic Debits</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No manual invoices or contracts. Simply maintain a funded Lorabiz wallet balance and your server executes automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Synchronous Identity Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Identity & Verification Endpoints</h2>
            <p className="text-xs text-muted-foreground">Instant synchronous execution with raw Base64 slips and demographics.</p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Endpoint</th>
                <th className="px-5 py-3">Format / Output</th>
                <th className="px-5 py-3">Wholesale Rate</th>
                <th className="px-5 py-3">Web Retail</th>
                <th className="px-5 py-3 text-right">Developer Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {identityServices.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-foreground">{item.service}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-primary">{item.endpoint}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.slip}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.wholesalePrice}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-muted-foreground line-through">
                    {item.retailPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Save {item.savings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {identityServices.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{item.service}</h3>
                  <p className="text-[11px] text-muted-foreground">{item.slip}</p>
                </div>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {item.wholesalePrice}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/60">
                <code className="text-primary font-mono">{item.endpoint}</code>
                <span className="text-muted-foreground line-through">{item.retailPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Asynchronous Exception Services */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Exception Clearances & Asynchronous Services</h2>
          <p className="text-xs text-muted-foreground">
            Submitted via API, tracked via status polling endpoints and automated HMAC-signed Webhook events.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
              <tr>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Endpoint</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Wholesale Rate</th>
                <th className="px-5 py-3">Web Retail</th>
                <th className="px-5 py-3 text-right">Turnaround (TAT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {clearanceServices.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-foreground">{item.service}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-primary">{item.endpoint}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{item.description}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.wholesalePrice}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-muted-foreground line-through">
                    {item.retailPrice}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-foreground">
                    {item.turnaround}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {clearanceServices.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-foreground">{item.service}</h3>
                  <p className="text-[11px] text-muted-foreground">{item.description}</p>
                </div>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {item.wholesalePrice}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/60">
                <code className="text-primary font-mono">{item.endpoint}</code>
                <span className="text-muted-foreground font-medium">TAT: {item.turnaround}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
