"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Zap, TrendingUp, PlusCircle, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

interface DeveloperMetricCardsProps {
  environment: "LIVE" | "TEST";
  walletBalance: number;
  sandboxBalance: number;
  totalSpent: number;
  totalCallsToday: number;
  successfulCallsToday?: number;
  failedCallsToday?: number;
  successRate: number | null; // null when no calls made
}

export const DeveloperMetricCards: React.FC<DeveloperMetricCardsProps> = ({
  environment,
  walletBalance,
  sandboxBalance,
  totalSpent,
  totalCallsToday,
  successfulCallsToday = 0,
  failedCallsToday = 0,
  successRate,
}) => {
  const isLive = environment === "LIVE";
  const displayBalance = isLive ? walletBalance : sandboxBalance;

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 to-card/40 backdrop-blur-md shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-3 lg:divide-y-0 lg:divide-x">
        {/* Metric 1: Available Liquidity / Credits */}
        <div className="p-6 transition-all hover:bg-muted/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  isLive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                }`}
              >
                <Wallet className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isLive ? "Live API Balance" : "Sandbox Test Credits"}
              </span>
            </div>

            {isLive ? (
              <Link
                href="/dashboard/wallet"
                className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Top Up</span>
              </Link>
            ) : (
              <span className="rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                Virtual ₦1,000,000
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ₦{displayBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {isLive
                ? "Deducted in real time per authenticated endpoint call."
                : "Free simulated credit line for end-to-end integration testing."}
            </p>
          </div>
        </div>

        {/* Metric 2: Total Cumulative API Spend */}
        <div className="p-6 transition-all hover:bg-muted/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isLive ? "Cumulative Spend" : "Simulated Test Spend"}
              </span>
            </div>
            <span className="rounded-md bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              All Time
            </span>
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              ₦{totalSpent.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {isLive
                ? "Total live volume invoiced and fulfilled via API keys."
                : "Total simulated volume processed in test sandbox environment."}
            </p>
          </div>
        </div>

        {/* Metric 3: Today's Requests & Truth-in-Metrics */}
        <div className="p-6 transition-all hover:bg-muted/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                API Calls (Today)
              </span>
            </div>

            {successRate === null ? (
              <span className="rounded-md bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                No activity today
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                  successRate >= 98
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : successRate >= 90
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
                }`}
              >
                {successRate >= 90 ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {successRate}% Success
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {totalCallsToday.toLocaleString()}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {totalCallsToday > 0
                ? `${successfulCallsToday} successful, ${failedCallsToday} failed in the last 24 hours.`
                : "Queries executed today will register here in real time."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
