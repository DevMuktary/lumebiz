"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { DeveloperConsoleHeader } from "@/components/features/developer/DeveloperConsoleHeader";
import { DeveloperMetricCards } from "@/components/features/developer/DeveloperMetricCards";
import { ApiKeyManager, ApiKeyItem } from "@/components/features/developer/ApiKeyManager";
import { WebhookConfigCard } from "@/components/features/developer/WebhookConfigCard";
import { RequestStreamTable } from "@/components/features/developer/RequestStreamTable";
import { ApiServiceHistoryTable } from "@/components/features/developer/ApiServiceHistoryTable";
import { LiveActivationModal } from "@/components/features/developer/LiveActivationModal";
import { Key, History, Activity, Webhook, ShieldCheck } from "lucide-react";

type DeveloperTab = "keys" | "history" | "debugger";

function DeveloperDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab: keys | history | debugger
  const urlTab = searchParams.get("tab") as DeveloperTab | null;
  const [activeTab, setActiveTab] = useState<DeveloperTab>(
    urlTab === "history" || urlTab === "debugger" ? urlTab : "keys"
  );

  const [environment, setEnvironment] = useState<"LIVE" | "TEST">("TEST");
  const [stats, setStats] = useState({
    walletBalance: 0,
    sandboxBalance: 1000000,
    totalSpentLive: 0,
    totalSpentTest: 0,
    totalCallsToday: 0,
    successfulCallsToday: 0,
    failedCallsToday: 0,
    successRate: null as number | null,
    liveKeysCount: 0,
    testKeysCount: 0,
  });

  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [isKeysLoading, setIsKeysLoading] = useState(true);

  const [developerProfile, setDeveloperProfile] = useState<any | null>(null);
  const [isLiveActivationOpen, setIsLiveActivationOpen] = useState(false);

  // Sync tab with URL search parameter
  const handleTabChange = (tab: DeveloperTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  };

  // Authentication gate
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login?callbackUrl=/dashboard/developer");
    }
  }, [status, router]);

  // Load Overview Stats
  const loadOverview = useCallback(async () => {
    try {
      const res = await fetch("/api/developer/overview");
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.activeMode) {
          setEnvironment(data.data.activeMode);
        }
        setStats({
          walletBalance: data.data.walletBalance,
          sandboxBalance: data.data.sandboxBalance,
          totalSpentLive: data.data.totalSpentLive || 0,
          totalSpentTest: data.data.totalSpentTest || 0,
          totalCallsToday: data.data.totalCallsToday,
          successfulCallsToday: data.data.successfulCallsToday || 0,
          failedCallsToday: data.data.failedCallsToday || 0,
          successRate: data.data.successRate,
          liveKeysCount: data.data.liveKeysCount,
          testKeysCount: data.data.testKeysCount,
        });
        setDeveloperProfile(data.data.developerProfile);
      }
    } catch (err) {
      console.error("Failed to load developer overview:", err);
    }
  }, []);

  // Handle Environment Toggle with PostgreSQL persistence
  const handleToggleEnvironment = async (newEnv: "LIVE" | "TEST") => {
    if (newEnv === "LIVE" && developerProfile?.status !== "APPROVED") {
      setIsLiveActivationOpen(true);
      return;
    }

    setEnvironment(newEnv);

    // Persist preference to PostgreSQL
    try {
      await fetch("/api/developer/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newEnv }),
      });
    } catch (err) {
      console.warn("Failed to persist developer mode preference:", err);
    }
  };

  // Load Keys for active environment
  const loadKeys = useCallback(async () => {
    setIsKeysLoading(true);
    try {
      const res = await fetch(`/api/developer/keys?environment=${environment}`);
      const data = await res.json();
      if (data.success) {
        setKeys(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load keys:", err);
    } finally {
      setIsKeysLoading(false);
    }
  }, [environment]);

  // Load Profile
  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/developer/profile");
      const data = await res.json();
      if (data.success) {
        setDeveloperProfile(data.data);
      }
    } catch (err) {
      console.error("Failed to load developer profile:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadOverview();
      loadProfile();
    }
  }, [status, loadOverview, loadProfile]);

  useEffect(() => {
    if (status === "authenticated") {
      loadKeys();
    }
  }, [status, environment, loadKeys]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-xs text-muted-foreground animate-pulse">Loading Developer Hub...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* 1. Fluid Console Header */}
      <DeveloperConsoleHeader
        environment={environment}
        onToggleEnvironment={handleToggleEnvironment}
        liveApprovalStatus={developerProfile?.status}
      />

      {/* 2. Fluid Executive Command Deck (Stretches smoothly) */}
      <DeveloperMetricCards
        environment={environment}
        walletBalance={stats.walletBalance}
        sandboxBalance={stats.sandboxBalance}
        totalSpent={environment === "LIVE" ? stats.totalSpentLive : stats.totalSpentTest}
        totalCallsToday={stats.totalCallsToday}
        successfulCallsToday={stats.successfulCallsToday}
        failedCallsToday={stats.failedCallsToday}
        successRate={stats.successRate}
      />

      {/* 3. Sleek Workspace Tabs (Stripe / Vercel style) */}
      <div className="border-b border-border/80">
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabChange("keys")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "keys"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Key className="h-4 w-4" />
            <span>API Keys &amp; Webhooks</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("history")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Unified Service History</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              All Orders
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("debugger")}
            className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "debugger"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>HTTP Request Debugger</span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Live Stream
            </span>
          </button>
        </div>
      </div>

      {/* 4. Tab Panels */}
      <div className="w-full pt-1">
        {/* TAB 1: API Keys & Webhooks */}
        {activeTab === "keys" && (
          <div className="w-full space-y-6 animate-in fade-in duration-200">
            <ApiKeyManager
              environment={environment}
              keys={keys}
              isLoading={isKeysLoading}
              onRefreshKeys={() => {
                loadKeys();
                loadOverview();
              }}
              onRequestLiveAccess={() => setIsLiveActivationOpen(true)}
              liveApprovalStatus={developerProfile?.status}
            />

            <WebhookConfigCard />
          </div>
        )}

        {/* TAB 2: ONE DEDICATED API Service History Hub */}
        {activeTab === "history" && (
          <div className="w-full animate-in fade-in duration-200">
            <ApiServiceHistoryTable />
          </div>
        )}

        {/* TAB 3: HTTP Request Debugger & Live Traffic Stream */}
        {activeTab === "debugger" && (
          <div className="w-full animate-in fade-in duration-200">
            <RequestStreamTable
              environment={environment}
              onViewServiceHistory={() => handleTabChange("history")}
            />
          </div>
        )}
      </div>

      {/* 5. Live Mode 1-Minute Compliance Modal */}
      <LiveActivationModal
        isOpen={isLiveActivationOpen}
        onClose={() => setIsLiveActivationOpen(false)}
        onSuccess={() => {
          loadProfile();
          loadOverview();
        }}
        currentProfile={developerProfile}
      />
    </div>
  );
}

export default function DeveloperDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-xs text-muted-foreground animate-pulse">Loading Developer Console...</div>
        </div>
      }
    >
      <DeveloperDashboardContent />
    </Suspense>
  );
}
