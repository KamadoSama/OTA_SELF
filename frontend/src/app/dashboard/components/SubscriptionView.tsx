"use client";

import { CreditCard, Zap, Clock, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useUpdates";

export function SubscriptionView() {
  const { data: stats, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!stats) return null;

  const usageItems = [
    { label: "Monthly Downloads", used: stats.monthlyDownloads.toLocaleString(), total: (stats.downloadLimit / 1000) + "k", percent: (stats.monthlyDownloads / stats.downloadLimit) * 100 },
    { label: "Active Apps", used: stats.activeApps, total: stats.appsLimit, percent: (stats.activeApps / stats.appsLimit) * 100 },
    { label: "Storage Used", used: stats.storageUsed, total: stats.storageLimit, percent: 42 },
    { label: "API Keys", used: "8", total: "Unlimited", percent: 0 }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-10 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Subscription</h1>
          <p className="text-sm text-white/40 font-medium">Manage your current plan and usage limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded border border-white/[0.06] bg-[#050505] p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-white text-black text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Zap className="h-3 w-3 fill-black" /> Current Plan
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{stats.tier} Tier</h3>
                <p className="text-sm text-white/40 font-medium">Perfect for growing teams and high-frequency deployments.</p>
              </div>
              <div className="sm:text-right">
                <div className="text-3xl font-bold">$49<span className="text-sm text-white/20 font-medium">/mo</span></div>
                <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mt-1">Billed monthly</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
              {usageItems.map((usage, i) => (
                <div key={i} className="space-y-2 p-4 rounded bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/30">
                    <span>{usage.label}</span>
                    <span className="text-white/60">{usage.used} / {usage.total}</span>
                  </div>
                  {usage.percent > 0 && (
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${usage.percent}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 rounded bg-white py-3 text-sm font-bold text-black hover:bg-white/90 transition-all">Manage Billing</button>
              <button className="flex-1 rounded border border-white/10 py-3 text-sm font-bold hover:bg-white/5 transition-all text-white/60">Upgrade Plan</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Next Payment</h4>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-white/20" />
              <div>
                <div className="text-sm font-bold">{new Date(stats.nextBillingDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <p className="text-xs text-white/40">Amount: $49.00</p>
              </div>
            </div>
          </div>

          <div className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Payment Method</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-white/20" />
                <div>
                  <div className="text-sm font-bold">{stats.paymentMethod}</div>
                  <p className="text-xs text-white/40">Expires 12/28</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-white/40 hover:text-white underline underline-offset-4">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
