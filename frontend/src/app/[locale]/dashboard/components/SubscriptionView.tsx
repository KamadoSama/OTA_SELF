"use client";

import { CreditCard, Zap, Clock, Loader2, ArrowRight, ShieldCheck, ChevronRight, Terminal } from "lucide-react";
import { useSubscription, useUpgradePlan, useDowngradePlan } from "@/hooks/useUpdates";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";

export function SubscriptionView() {
  const { data: stats, isLoading } = useSubscription();
  const { mutate: upgrade, isPending: isUpgrading } = useUpgradePlan();
  const { mutate: downgrade, isPending: isDowngrading } = useDowngradePlan();
  const [showConfirmDowngrade, setShowConfirmDowngrade] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const isPro = stats?.tier === 'PRO';
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === 'true';
  const isExpired = !isSelfHosted && stats?.trialEndsAt && new Date(stats.trialEndsAt) < new Date() && !stats.cardLast4;

  useEffect(() => {
    if (isExpired) {
      setShowPaymentModal(true);
    }
  }, [isExpired]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  if (!stats) return null;
  
  const usageItems = [
    { 
      label: "Monthly Downloads", 
      used: stats.monthlyDownloads.toLocaleString(), 
      total: isPro ? (stats.downloadLimit / 1000) + "k" : "1,000", 
      percent: Math.min((stats.monthlyDownloads / stats.downloadLimit) * 100, 100) 
    },
    { 
      label: "Active Apps", 
      used: stats.activeApps, 
      total: isPro ? "Unlimited" : "1", 
      percent: isPro ? 0 : (stats.activeApps / 1) * 100 
    },
    { 
      label: "Deployments Today", 
      used: stats.deploymentsToday, 
      total: isPro ? "Unlimited" : "2", 
      percent: isPro ? 0 : (stats.deploymentsToday / 2) * 100 
    },
    { 
      label: "API Keys", 
      used: stats.activeApiKeys || "0", 
      total: isPro ? "Unlimited" : "1", 
      percent: isPro ? 0 : (stats.activeApiKeys / 1) * 100 
    }
  ];
  
  const validateForm = () => {
    if (formData.cardNumber.replace(/\s/g, '').length < 12) return "Please enter a valid card number.";
    if (!formData.expiry.includes('/')) return "Please enter a valid expiry date (MM/YY).";
    if (formData.cvc.length < 3) return "Please enter a valid CVC.";
    return null;
  };
  
  const handleUpgrade = () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }
    
    setFormError(null);
    // Extract info from formData
    const last4 = formData.cardNumber.replace(/\s/g, '').slice(-4);
    const [month, year] = formData.expiry.split('/').map(s => parseInt(s.trim()));
    
    upgrade({
      last4,
      brand: "Visa", // Simplified for now
      expMonth: month || 12,
      expYear: year ? (year < 100 ? 2000 + year : year) : 2026
    }, {
      onSuccess: () => {
        posthog.capture("plan_upgraded", { plan: "PRO", amount: 19 });
        setShowPaymentModal(false);
      },
      onError: (err) => {
        posthog.captureException(err, { extra: { context: "upgrade_plan" } });
      },
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {isExpired && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-red-500">Trial Expired</h3>
              <p className="text-sm text-white/60">Your professional trial ended on {new Date(stats.trialEndsAt!).toLocaleDateString()}. Please add a payment method to keep your unlimited access.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shrink-0"
          >
            Add Payment Method
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-10 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">
            {isSelfHosted ? 'Server Status' : 'Subscription'}
          </h1>
          <p className="text-sm text-white/40 font-medium">
            {isSelfHosted 
              ? 'Community Edition - All features unlocked.' 
              : 'Manage your current plan and usage limits.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded border border-white/[0.06] bg-[#050505] p-6 sm:p-8 space-y-8 relative overflow-hidden">
            {(isPro || isSelfHosted) && (
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="h-24 w-24 text-white/[0.03] -mr-8 -mt-8" />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative z-10">
              <div className="space-y-1">
                <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${ (isPro || isSelfHosted) ? 'bg-white text-black' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                  <Zap className={`h-3 w-3 ${(isPro || isSelfHosted) ? 'fill-black' : ''}`} /> Current Plan: {isSelfHosted ? 'Self-Hosted' : stats.tier}
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{isSelfHosted ? 'Unlimited' : (isPro ? 'Professional' : 'Hobby')} Tier</h3>
                <p className="text-sm text-white/40 font-medium max-w-sm">
                  {isSelfHosted
                    ? 'You are running your own ZenOTA instance. All features are enabled by default without any usage limits.'
                    : isPro 
                      ? 'Pro-grade update delivery for growing teams. No limits on apps or deployments.' 
                      : 'Great for getting started. Perfect for personal projects and small experiments.'}
                </p>
              </div>
              {!isSelfHosted && (
                <div className="sm:text-right">
                  <div className="text-3xl font-bold">${isPro ? '19' : '0'}<span className="text-sm text-white/20 font-medium">/mo</span></div>
                  <p className="text-[11px] text-white/30 font-bold uppercase tracking-widest mt-1">
                    {isPro ? 'Billed monthly' : 'Free forever'}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="h-3.5 w-3.5 text-white/40" /> Unlimited Apps & Channels</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="h-3.5 w-3.5 text-white/40" /> Private Storage (MinIO)</li>
                  <li className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="h-3.5 w-3.5 text-white/40" /> Full CLI Analytics</li>
                </ul>
              </div>
              <div className="flex flex-col justify-end gap-3">
                {!isSelfHosted && (
                  !isPro ? (
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full flex items-center justify-center gap-2 rounded bg-white py-2.5 text-[13px] font-bold text-black hover:bg-white/90 transition-all"
                    >
                      Upgrade to Pro <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowConfirmDowngrade(true)}
                      className="w-full rounded border border-white/10 py-2.5 text-[13px] font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Downgrade to Hobby
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {usageItems.map((item, idx) => (
              <div key={idx} className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30">{item.label}</h4>
                  <span className="text-xs font-mono text-white/60">{item.used} / {item.total}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${item.percent > 90 ? 'bg-red-500' : 'bg-white'}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isSelfHosted && (
          <div className="space-y-6">
            <div className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Billing Method</h4>
              {stats.cardLast4 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white/40" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{stats.cardBrand} •••• {stats.cardLast4}</div>
                      <div className="text-[11px] text-white/30">Expires {stats.cardExpMonth}/{stats.cardExpYear}</div>
                    </div>
                  </div>
                  <button className="w-full text-xs font-bold text-white/40 hover:text-white transition-colors">Update card details</button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white/20" />
                  </div>
                  <p className="text-[13px] text-white/40 max-w-[180px]">No payment method on file.</p>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="text-xs font-bold text-white hover:underline"
                  >
                    Add Payment Method
                  </button>
                </div>
              )}
            </div>

            <div className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Next Payment</h4>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-white/20" />
                <div className="text-sm font-medium">
                  {stats.nextBillingDate ? new Date(stats.nextBillingDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <p className="text-[11px] text-white/30 leading-relaxed">
                Your next invoice will be generated on {stats.nextBillingDate ? new Date(stats.nextBillingDate).toLocaleDateString() : 'N/A'}. 
                You will be charged <span className="text-white font-bold">${isPro ? '19.00' : '0.00'}</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Downgrade Modal */}
      {showConfirmDowngrade && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Downgrade to Hobby?</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Your unlimited limits will be restricted. If you have more than 1 app, some will be deactivated.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => downgrade(undefined, {
                  onSuccess: () => {
                    posthog.capture("plan_downgraded", { from_plan: "PRO", to_plan: "FREE" });
                    setShowConfirmDowngrade(false);
                  },
                  onError: (err) => {
                    posthog.captureException(err, { extra: { context: "downgrade_plan" } });
                  },
                })}
                className="w-full py-2.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-all"
              >
                Confirm Downgrade
              </button>
              <button 
                onClick={() => setShowConfirmDowngrade(false)}
                className="w-full py-2.5 border border-white/5 text-white/40 font-medium text-sm rounded-lg hover:text-white hover:bg-white/5 transition-all"
              >
                Keep Pro Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Professional Plan</h2>
              <p className="text-sm text-white/40">Enter your card details to start your 30-day free trial.</p>
            </div>

            {formError && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-in shake duration-300">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Card Information</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, cardNumber: e.target.value });
                      if (formError) setFormError(null);
                    }}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Expiry</label>
                  <input 
                    type="text" 
                    placeholder="12 / 26"
                    value={formData.expiry}
                    onChange={(e) => {
                      setFormData({ ...formData, expiry: e.target.value });
                      if (formError) setFormError(null);
                    }}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">CVC</label>
                  <input 
                    type="text" 
                    placeholder="•••"
                    value={formData.cvc}
                    onChange={(e) => {
                      setFormData({ ...formData, cvc: e.target.value });
                      if (formError) setFormError(null);
                    }}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Monthly Subscription</span>
                <span className="font-bold">$19.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">Free Trial Discount (30 days)</span>
                <span className="text-green-500 font-bold">-$19.00</span>
              </div>
              <div className="pt-2 border-t border-white/5 flex justify-between text-sm font-bold">
                <span>Total Due Today</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full py-3.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {isUpgrading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm & Start Trial"}
              </button>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setFormError(null);
                }}
                className="w-full py-3 text-xs font-bold text-white/30 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
            <p className="text-[10px] text-white/20 text-center leading-relaxed">
              By confirming, you agree to our terms of service. You will not be charged today. 
              We will send you a reminder 3 days before your trial ends.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
