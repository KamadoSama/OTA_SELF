"use client";

import { motion } from 'framer-motion';
import { ChevronRight, Server, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Pricing() {
  const t = useTranslations();

  return (
    <section id="pricing" className="py-24 px-6 relative border-t border-white/5">
      <div className="container relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">{t.rich('Pricing.title', { lb: () => <br /> })}</h2>
          <p className="text-white/40 max-w-xl mx-auto font-medium">{t('Pricing.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* 1. Community Self-Hosted Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="group relative rounded-3xl glass p-10 transition-all hover:bg-white/[0.04] border border-blue-500/20 bg-blue-500/[0.02] flex flex-col justify-between"
          >
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Community Edition</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">Self-Hosted</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tighter text-white">$0</span>
                  <span className="text-white/30 text-sm font-mono">gratuit à vie</span>
                </div>
                <p className="text-xs text-white/40 mt-2">Sur votre propre VPS / serveur</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "MAU & Mises à jour 100% illimitées",
                  "Vos données dans vos buckets S3 / MinIO / R2",
                  "Canary Rollouts progressifs (%)",
                  "Instant Rollback en 200ms",
                  "CLI serveur d'installation en 1 ligne",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-white/70">
                    <ChevronRight className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/docs" className="h-12 w-full rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-center justify-center font-bold text-xs text-blue-300 hover:bg-blue-500 hover:text-white transition-all">
              <Server className="w-3.5 h-3.5 mr-2" />
              Guide d&apos;installation Self-Host
            </Link>
          </motion.div>

          {/* 2. Cloud Starter Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -6 }}
            className="group relative rounded-3xl glass p-10 transition-all hover:bg-white/[0.04] flex flex-col justify-between"
          >
            <div>
              <div className="mb-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-4">{t('Pricing.hobby.name')}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tighter text-white">{t('Pricing.hobby.price')}</span>
                  <span className="text-white/20 text-sm">{t('Pricing.hobby.frequency')}</span>
                </div>
                <p className="text-xs text-white/40 mt-2">ZenOTA Cloud managé</p>
              </div>

              <div className="space-y-4 mb-8">
                {(t.raw('Pricing.hobby.features') as string[]).map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-white/50 group-hover:text-white/80 transition-colors">
                    <ChevronRight className="h-3.5 w-3.5 text-white/20 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register?plan=free" className="h-12 w-full rounded-xl border border-white/10 flex items-center justify-center font-bold text-xs text-white hover:bg-white hover:text-black transition-all">
              {t('Pricing.hobby.cta')}
            </Link>
          </motion.div>

          {/* 3. Cloud Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -8 }}
            className="group relative rounded-3xl bg-white p-10 transition-all overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.12)] flex flex-col justify-between text-black"
          >
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">{t('Pricing.pro.name')}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {t('Pricing.pro.popular')}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tighter">{t('Pricing.pro.price')}</span>
                  <span className="text-black/40 text-sm">{t('Pricing.pro.frequency')}</span>
                </div>
                <p className="text-xs text-black/50 mt-2">Sans aucune surprise au MAU</p>
              </div>

              <div className="space-y-4 mb-8">
                {(t.raw('Pricing.pro.features') as string[]).map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs font-semibold text-black/70">
                    <ChevronRight className="h-3.5 w-3.5 text-black/30 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/register?plan=pro" className="h-12 w-full rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs hover:bg-black/90 transition-all shadow-xl">
              {t('Pricing.pro.cta')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
