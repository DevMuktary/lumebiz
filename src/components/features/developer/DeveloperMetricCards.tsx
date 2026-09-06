"use client";

import React from "react";
import Link from "next/link";
import { Wallet, Zap, TrendingUp, PlusCircle } from "lucide-react";

interface DeveloperMetricCardsProps {
  environment: "LIVE" | "TEST";
  walletBalance: number;
  sandboxBalance: number;
  totalSpent: number;
  totalCallsToday: number;
  successRate: number;
}

export const DeveloperMetricCards: React.FC<DeveloperMetricCardsProps> = ({
  environment,
  walletBalance,
  sandboxBalance,
  totalSpent,
  totalCallsToday,
  successRate,
}) => {
  const isLive = environment === "LIVE";
  const displayBalance = isLive ? walletBalance : sandboxBalance;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* 1. Wallet Balance Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isLive ? "Available Wallet Balance" : "Sandbox Test Credits"}
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              isLive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}
          >
            <Wallet className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            ₦{displayBalance.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {isLive ? (
            <Link
              href="/dashboard/wallet"
              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Fund
            </Link>
          ) : (
            <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              Virtual ₦1M
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {isLive
            ? "Auto-debited per successful query."
            : "Simulated sandbox balance for risk-free testing."}
        </p>
      </div>

      {/* 2. Total Spent Card (Replaced Average Latency) */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isLive ? "Total API Spend" : "Simulated Test Spend"}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            ₦{totalSpent.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
            Cumulative
          </span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {isLive
            ? "Total debited across all live API requests."
            : "Total virtual credits spent during test mode."}
        </p>
      </div>

      {/* 3. API Requests (Today) Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            API Requests (Today)
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Zap className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-mono">
            {totalCallsToday.toLocaleString()}
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
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
          Resetting at 00:00 UTC. Live logs stream below.
        </p>
      </div>
    </div>
  );
};
