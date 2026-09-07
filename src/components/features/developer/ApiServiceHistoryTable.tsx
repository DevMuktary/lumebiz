"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  Eye,
  FileText,
  X,
  ExternalLink,
} from "lucide-react";
import { UnifiedServiceItem } from "@/app/api/developer/history/route";

interface ApiServiceHistoryTableProps {
  initialServiceFilter?: string;
}

export const ApiServiceHistoryTable: React.FC<ApiServiceHistoryTableProps> = ({
  initialServiceFilter = "ALL",
}) => {
  const [items, setItems] = useState<UnifiedServiceItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [serviceFilter, setServiceFilter] = useState(initialServiceFilter);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspect Drawer / Modal state
  const [selectedItem, setSelectedItem] = useState<UnifiedServiceItem | null>(null);

  // Copy reference state
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/developer/history", window.location.origin);
      url.searchParams.set("service", serviceFilter);
      url.searchParams.set("status", statusFilter);
      if (searchQuery.trim()) {
        url.searchParams.set("query", searchQuery.trim());
      }
      url.searchParams.set("limit", "100");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data.items || []);
        setTotalCount(data.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load API service history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [serviceFilter, statusFilter, searchQuery]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const getStatusBadge = (status: UnifiedServiceItem["status"]) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    }
    if (status === "PROCESSING") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
          <Clock className="h-3 w-3 animate-spin" />
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2.5 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400">
        <AlertCircle className="h-3 w-3" />
        Failed
      </span>
    );
  };

  const getServiceColor = (service: UnifiedServiceItem["service"]) => {
    switch (service) {
      case "NIN_SLIP":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "NIN_IPE":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "NIN_PERSONALIZATION":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "NIN_VALIDATION":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "BVN_VERIFY":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const serviceOptions = [
    { value: "ALL", label: "All Services" },
    { value: "NIN_SLIP", label: "NIN Slips" },
    { value: "NIN_IPE", label: "IPE Clearances" },
    { value: "NIN_PERSONALIZATION", label: "Personalizations" },
    { value: "NIN_VALIDATION", label: "Validations" },
    { value: "BVN_VERIFY", label: "BVN Lookups" },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Header & Filter Deck */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground sm:text-xl">
                  Unified API Service History
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consolidated orders, verification results, tracking references, and printable slip documents.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Box */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, NIN, BVN..."
                className="w-full rounded-xl border border-border bg-background/80 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={fetchHistory}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          {/* Service Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {serviceOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setServiceFilter(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  serviceFilter === opt.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Status:</span>
            <div className="flex rounded-lg border border-border bg-background/80 p-0.5">
              {(["ALL", "SUCCESS", "PROCESSING", "FAILED"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    statusFilter === st
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st === "ALL" ? "All" : st === "SUCCESS" ? "Completed" : st === "PROCESSING" ? "In-Flight" : "Failed"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Service</th>
                <th className="py-3.5 px-5 font-semibold">Identifier</th>
                <th className="py-3.5 px-5 font-semibold">Subject / Name</th>
                <th className="py-3.5 px-5 font-semibold">Reference</th>
                <th className="py-3.5 px-5 font-semibold">Fee Charged</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Timestamp</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                    <span>Loading unified API service records...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <History className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="font-semibold text-sm text-foreground">No Service Orders Found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery
                        ? "No orders match your search criteria."
                        : "Requests performed via the API or dashboard will automatically populate here."}
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(row)}
                  >
                    {/* Service */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getServiceColor(
                          row.service
                        )}`}
                      >
                        {row.serviceLabel}
                      </span>
                    </td>

                    {/* Identifier */}
                    <td className="py-3.5 px-5 whitespace-nowrap font-medium text-foreground">
                      {row.identifier}
                    </td>

                    {/* Subject Name */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {row.fullName ? (
                        <span className="font-medium text-foreground">{row.fullName}</span>
                      ) : (
                        <span className="text-muted-foreground italic">Pending resolution</span>
                      )}
                    </td>

                    {/* Reference */}
                    <td
                      className="py-3.5 px-5 whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(row.reference);
                      }}
                    >
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground font-mono transition-colors"
                        title="Click to copy reference"
                      >
                        <span>{row.reference.slice(0, 16)}...</span>
                        {copiedRef === row.reference ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground/60" />
                        )}
                      </button>
                    </td>

                    {/* Fee Charged */}
                    <td className="py-3.5 px-5 whitespace-nowrap font-medium text-foreground">
                      ₦{row.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 whitespace-nowrap">{getStatusBadge(row.status)}</td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {row.pdfUrl && (
                          <a
                            href={row.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            title="Download Slip PDF"
                          >
                            <Download className="h-3 w-3" />
                            <span>Slip</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedItem(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{items.length}</strong> of{" "}
            <strong className="text-foreground">{totalCount}</strong> recorded transactions
          </span>
          <span className="text-[11px] text-muted-foreground">
            All API and dashboard requests are recorded permanently in this audit hub.
          </span>
        </div>
      </div>

      {/* Record Inspection Slide-Over / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="h-full w-full max-w-lg border-l border-border bg-card p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getServiceColor(
                        selectedItem.service
                      )}`}
                    >
                      {selectedItem.serviceLabel}
                    </span>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <h3 className="text-base font-bold text-foreground mt-2">
                    Order Reference Details
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Core Parameters */}
              <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Reference:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                    <span>{selectedItem.reference}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedItem.reference)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {copiedRef === selectedItem.reference ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Identifier:</span>
                  <span className="font-semibold text-foreground">{selectedItem.identifier}</span>
                </div>

                {selectedItem.fullName && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-bold text-foreground">{selectedItem.fullName}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fee Charged:</span>
                  <span className="font-bold text-foreground">
                    ₦{selectedItem.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Created At:</span>
                  <span className="text-foreground">
                    {new Date(selectedItem.createdAt).toLocaleString("en-NG")}
                  </span>
                </div>

                {selectedItem.failureReason && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 mt-2">
                    <p className="font-bold">Failure Reason:</p>
                    <p className="mt-0.5">{selectedItem.failureReason}</p>
                  </div>
                )}
              </div>

              {/* Extra Metadata Details */}
              {selectedItem.details && Object.keys(selectedItem.details).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Service Metadata
                  </h4>
                  <div className="rounded-xl border border-border/80 bg-background/50 p-4 space-y-2 text-xs">
                    {Object.entries(selectedItem.details).map(([k, v]) => {
                      if (v === null || v === undefined || v === "") return null;
                      return (
                        <div key={k} className="flex justify-between border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-muted-foreground capitalize">
                            {k.replace(/([A-Z])/g, " $1")}:
                          </span>
                          <span className="font-medium text-foreground">{String(v)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-border/60 pt-4 mt-6 flex items-center justify-between gap-3">
              {selectedItem.pdfUrl ? (
                <a
                  href={selectedItem.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Slip Document</span>
                </a>
              ) : (
                <div className="flex-1 text-center text-xs text-muted-foreground">
                  No generated slip document for this record.
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
