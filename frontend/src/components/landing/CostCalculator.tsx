"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Check, ArrowRight, ShieldCheck, DollarSign } from "lucide-react";
import { Link } from "@/i18n/routing";

export function CostCalculator() {
  const [mau, setMau] = useState<number>(50000);

  // Expo EAS Update pricing model:
  // Base Production plan = $29/mo (includes 1,000 update MAUs)
  // Additional update MAUs = $0.005 per active user
  const calculateEasCost = (activeUsers: number) => {
    if (activeUsers <= 1000) return 29;
    const additional = (activeUsers - 1000) * 0.005;
    return Math.round(29 + additional);
  };

  const easMonthly = calculateEasCost(mau);
  const easYearly = easMonthly * 12;

  const zenotaSelfHostedMonthly = 0;
  const zenotaCloudMonthly = 19;
  const yearlySavings = easYearly - (zenotaSelfHostedMonthly * 12);

  return (
    <section id="calculator" className="py-24 px-6 relative z-10 border-t border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
      <div className="container max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-4 border border-emerald-500/20">
            <DollarSign className="w-3 h-3" />
            Zero MAU Tax
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Pourquoi payer chaque mois pour vos utilisateurs ?
          </h2>
          <p className="text-white/40 text-base md:text-lg leading-relaxed">
            EAS Update vous taxe au MAU (Monthly Active Users). Dès que votre application décolle, la facture explose.
            Avec ZenOTA, vous gardez 100% du contrôle avec zéro surcoût par utilisateur.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden bg-black/50 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Slider and Controls */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label htmlFor="mau-slider" className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Utilisateurs Actifs Mensuels (MAU)
                  </label>
                  <span className="text-3xl font-black font-mono text-white">
                    {mau.toLocaleString()} <span className="text-sm font-normal text-white/40">MAU</span>
                  </span>
                </div>

                <input
                  id="mau-slider"
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={mau}
                  onChange={(e) => setMau(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />

                <div className="flex justify-between text-[11px] font-mono text-white/30 mt-2">
                  <span>5k</span>
                  <span>50k</span>
                  <span>100k</span>
                  <span>200k</span>
                  <span>300k+</span>
                </div>
              </div>

              {/* Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5 text-xs text-white/60">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Mises à jour illimitées</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/60">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Aucun bridage de débit</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/60">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Données sur votre propre S3 / MinIO</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/60">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Rollout déterministe & Rollback</span>
                </div>
              </div>
            </div>

            {/* Right Column: Comparative result cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* EAS Card */}
              <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/[0.03] space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-red-400">
                  <span>Expo EAS Update</span>
                  <span className="font-mono text-red-400/80">facturation au MAU</span>
                </div>
                <div className="text-2xl font-black font-mono text-white/80">
                  ~${easMonthly} <span className="text-xs font-normal text-white/40">/ mois</span>
                </div>
                <div className="text-[11px] text-white/30">
                  Soit environ <strong className="text-white/60">${easYearly.toLocaleString()}</strong> par an pour ce volume.
                </div>
              </div>

              {/* ZenOTA Card */}
              <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] space-y-2 relative shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <span>ZenOTA Self-Hosted</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                    100% Gratuit
                  </span>
                </div>
                <div className="text-4xl font-black font-mono text-emerald-300">
                  $0 <span className="text-xs font-normal text-white/40">/ mois</span>
                </div>
                <div className="text-xs text-emerald-200/80 pt-1 font-medium">
                  Économie estimée : <strong className="text-white text-sm">${yearlySavings.toLocaleString()}</strong> / an
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/docs"
                  className="flex-1 h-11 px-5 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg"
                >
                  Déployer en Self-Host
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/register"
                  className="h-11 px-5 rounded-xl glass text-white/80 hover:text-white font-semibold text-xs flex items-center justify-center transition-all"
                >
                  Essayer le Cloud
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
