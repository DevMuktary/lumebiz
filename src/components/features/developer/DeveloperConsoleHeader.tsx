"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Tag, Activity, ShieldCheck, Sparkle } from "lucide-react";

interface DeveloperConsoleHeaderProps {
  environment: "LIVE" | "TEST";
  onToggleEnvironment: (env: "LIVE" | "TEST") => void;
  onOpenPricingModal: () => void;
  liveApprovalStatus?: string | null;
}

export const DeveloperConsoleHeader: React.FC<DeveloperConsoleHeaderProps> = ({
  environment,
  onToggleEnvironment,
  onOpenPricingModal,
  liveApprovalStatus,
}) => {
  const isLive = environment === "LIVE";

  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Developer Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your API keys, inspect real-time request logs, and configure webhooks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Hub Links */}
        <Link
          href="/docs"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          <span>Documentation</span>
        </Link>

        <button
          onClick={onOpenPricingModal}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Tag className="h-3.5 w-3.5 text-emerald-500" />
          <span>API Rates</span>
        </button>

        <a
          href="https://status.lorabiz.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Activity className="h-3.5 w-3.5 text-blue-500" />
          <span>System Status</span>
        </a>

        {/* Environment Toggle Switch */}
        <div className="flex items-center rounded-xl border border-border/80 bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => onToggleEnvironment("TEST")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              !isLive
                ? "bg-amber-500/15 text-amber-600 shadow-sm dark:bg-amber-500/25 dark:text-amber-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            Test Mode
          </button>
          <button
            type="button"
            onClick={() => onToggleEnvironment("LIVE")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isLive
                ? "bg-emerald-500/15 text-emerald-600 shadow-sm dark:bg-emerald-500/25 dark:text-emerald-400"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Mode
          </button>
        </div>
      </div>
    </div>
  );
};
