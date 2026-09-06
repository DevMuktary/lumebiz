"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Zap, Clock, PlusCircle } from "lucide-react";

interface DeveloperMetricCardsProps {
  environment: "LIVE" | "TEST";
  walletBalance: number;
  sandboxBalance: number;
  totalCallsToday: number;
  successRate: number;
  avgLatencyMs: number;
}

export const DeveloperMetricCards: React.FC<DeveloperMetricCardsProps> = ({
  environment,
  walletBalance,
  sandboxBalance,
  totalCallsToday,
  successRate,
  avgLatencyMs,
}) => {
  const isLive = environment === "LIVE";
  const displayBalance = isLive ? walletBalance : sandboxBalance;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Wallet Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {isLive ? "Live Wallet Balance" : "Sandbox Balance (Test Credits)"}
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isLive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}
          >
            <Wallet className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ₦{displayBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {isLive ? (
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <PlusCircle className="h-3 w-3" />
              Fund
            </Link>
          ) : (
            <span className="rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Virtual ₦1M
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {isLive
            ? "Auto-debited per successful live API request."
            : "Virtual test funds. Never deducted from your real bank balance."}
        </p>
      </div>

      {/* 2. Requests & Success Rate Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            API Requests (Today)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Zap className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {totalCallsToday.toLocaleString()}
          </div>
          <span
            className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
              successRate >= 98
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : successRate >= 90
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                : "bg-red-500/15 text-red-600 dark:text-red-400"
            }`}
          >
            {successRate}% Success
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Resetting daily at 00:00 UTC. Live stream logs below.
        </p>
      </div>

      {/* 3. Average Latency Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Average Latency
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {avgLatencyMs > 0 ? `${avgLatencyMs}ms` : "< 350ms"}
          </div>
          <span className="rounded-md bg-purple-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            Optimized Base64
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Direct canonical pass-through without external storage delay.
        </p>
      </div>
    </div>
  );
};
