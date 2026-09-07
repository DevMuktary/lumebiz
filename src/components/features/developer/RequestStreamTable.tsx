"use client";

import React, { useState, useEffect } from "react";
import { Activity, Filter, RefreshCw, ChevronRight, History } from "lucide-react";
import { RequestInspectDrawer } from "./RequestInspectDrawer";

export interface LogItem {
  id: string;
  method: string;
  endpoint: string;
  statusCode: number;
  latencyMs: number;
  amountCharged: number;
  clientReference: string | null;
  errorMessage: string | null;
  createdAt: string;
}

interface RequestStreamTableProps {
  environment: "LIVE" | "TEST";
  onViewServiceHistory?: () => void;
}

export const RequestStreamTable: React.FC<RequestStreamTableProps> = ({
  environment,
  onViewServiceHistory,
}) => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Inspect Drawer
  const [inspectLogId, setInspectLogId] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs(true);
  }, [environment, serviceFilter, statusFilter]);

  const fetchLogs = async (reset = false) => {
    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const url = new URL("/api/developer/logs", window.location.origin);
      url.searchParams.set("environment", environment);
      url.searchParams.set("service", serviceFilter);
      url.searchParams.set("statusCode", statusFilter);
      url.searchParams.set("limit", "20");

      if (!reset && nextCursor) {
        url.searchParams.set("cursor", nextCursor);
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.success) {
        if (reset) {
          setLogs(data.data.logs || []);
        } else {
          setLogs((prev) => [...prev, ...(data.data.logs || [])]);
        }
        setNextCursor(data.data.nextCursor);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) {
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          {code} OK
        </span>
      );
    }
    if (code >= 400 && code < 500) {
      return (
        <span className="inline-flex items-center rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          {code} Error
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-md bg-red-500/15 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
        {code} Fail
      </span>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-xs overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                HTTP Request Stream (API Debugger)
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Low-level HTTP traffic and payload debugger for developer integrations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Direct Button to Unified API Service History */}
          {onViewServiceHistory && (
            <button
              type="button"
              onClick={onViewServiceHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <History className="h-3.5 w-3.5 text-primary" />
              <span>Unified Service History</span>
            </button>
          )}

          {/* Granular Service / Endpoint Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Endpoints</option>
              <option value="NIN_SEARCH">/v1/nin/by-nin (NIN Search)</option>
              <option value="NIN_PHONE">/v1/nin/by-phone (Phone Search)</option>
              <option value="NIN_IPE">/v1/nin/ipe (IPE Clearance)</option>
              <option value="NIN_VALIDATION">/v1/nin/validation (Validation)</option>
              <option value="NIN_PERSONALIZATION">/v1/nin/personalization</option>
              <option value="BVN">/v1/bvn/verify (BVN Verify)</option>
            </select>
          </div>

          {/* Status Code Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="2xx">2xx Success</option>
              <option value="4xx">4xx Client Errors</option>
              <option value="5xx">5xx Server Errors</option>
            </select>
          </div>

          <button
            onClick={() => fetchLogs(true)}
            title="Refresh stream"
            className="rounded-xl border border-border bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
            <span>Streaming request logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold text-foreground">No HTTP Requests Logged</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Requests initiated with your {environment} API keys will display in this stream with real-time latency and status codes.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Time</th>
                <th className="py-3.5 px-5 font-semibold">Method</th>
                <th className="py-3.5 px-5 font-semibold">Endpoint</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Latency</th>
                <th className="py-3.5 px-5 font-semibold">Cost</th>
                <th className="py-3.5 px-5 font-semibold">Client Ref</th>
                <th className="py-3.5 px-5 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setInspectLogId(log.id)}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                >
                  <td className="py-3.5 px-5 whitespace-nowrap text-muted-foreground">
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {log.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap font-mono text-xs font-semibold text-foreground">
                    {log.endpoint}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">{getStatusBadge(log.statusCode)}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-muted-foreground">
                    {log.latencyMs}ms
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap font-medium">
                    ₦{Number(log.amountCharged).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                    {log.clientReference || "—"}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs text-primary font-medium group-hover:underline">
                      Inspect
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination / Load More Footer */}
      {nextCursor && (
        <div className="border-t border-border/60 p-4 text-center bg-muted/20">
          <button
            onClick={() => fetchLogs(false)}
            disabled={isLoadingMore}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            {isLoadingMore ? "Loading more..." : "Load More Requests"}
          </button>
        </div>
      )}

      {/* Side Slide-Over Inspector Drawer */}
      <RequestInspectDrawer logId={inspectLogId} onClose={() => setInspectLogId(null)} />
    </div>
  );
};
