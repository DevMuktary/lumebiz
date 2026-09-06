"use client";

import React from "react";
import { X, Tag, CheckCircle2, Shield } from "lucide-react";

interface ApiPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiPricingModal: React.FC<ApiPricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rates = [
    { service: "NIN Verification by NIN", endpoint: "/v1/nin/by-nin", slip: "Basic Demographic", price: "₦100" },
    { service: "NIN Verification by NIN", endpoint: "/v1/nin/by-nin", slip: "Virtual NIN (vNIN)", price: "₦120" },
    { service: "NIN Verification by NIN", endpoint: "/v1/nin/by-nin", slip: "Regular Slip (PDF)", price: "₦150" },
    { service: "NIN Verification by NIN", endpoint: "/v1/nin/by-nin", slip: "Standard KYC Slip (PDF)", price: "₦200" },
    { service: "NIN Verification by NIN", endpoint: "/v1/nin/by-nin", slip: "Premium Card Slip (PDF)", price: "₦250" },
    { service: "NIN Verification by Phone", endpoint: "/v1/nin/by-phone", slip: "Regular / Standard / Premium", price: "₦300" },
    { service: "BVN KYC Verification", endpoint: "/v1/bvn/verify", slip: "Demographics & Match", price: "₦150" },
    { service: "NIN IPE Clearance", endpoint: "/v1/nin/ipe", slip: "Exception Resolution", price: "₦2,500" },
    { service: "NIN Validation", endpoint: "/v1/nin/validation", slip: "Modification Sync", price: "₦1,500" },
    { service: "NIN Personalization", endpoint: "/v1/nin/personalization", slip: "Interrupted Enrollment", price: "₦1,500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Tag className="h-5 w-5" />
            <h2 className="text-lg font-bold text-foreground">API Wholesale Pricing Rates</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1 pr-1">
          <div className="rounded-xl border border-border/80 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Service</th>
                  <th className="px-4 py-2.5">Endpoint</th>
                  <th className="px-4 py-2.5">Slip / Format</th>
                  <th className="px-4 py-2.5 text-right">Wholesale Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {rates.map((r, idx) => (
                  <tr key={idx} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-sans font-medium text-foreground">{r.service}</td>
                    <td className="px-4 py-2.5 text-[11px] text-primary">{r.endpoint}</td>
                    <td className="px-4 py-2.5 font-sans text-muted-foreground">{r.slip}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {r.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero Risk Billing Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              • In <strong>Test Mode</strong>, all queries deduct from your virtual ₦1,000,000 test balance. Zero real funds are touched.
            </p>
            <p className="text-[11px] leading-relaxed">
              • In <strong>Live Mode</strong>, wallet debits occur atomically per successful 2xx response. Failed client calls (4xx errors) are charged <strong>₦0.00</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-foreground px-5 py-2 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
