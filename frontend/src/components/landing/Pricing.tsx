"use client";

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">{t.rich('Pricing.title', { lb: (chunks) => <br /> })}</h2>
          <p className="text-white/40 max-w-xl mx-auto font-medium">{t('Pricing.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Hobby Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -10 }}
            className="group relative rounded-3xl glass p-12 transition-all hover:bg-white/[0.04] overflow-hidden"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-4">{t('Pricing.hobby.name')}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tighter text-white">{t('Pricing.hobby.price')}</span>
                  <span className="text-white/20 text-sm">{t('Pricing.hobby.frequency')}</span>
                </div>
              </div>
              <div className="space-y-6 mb-12 flex-1">
                {(t.raw('Pricing.hobby.features') as string[]).map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/50 group-hover:text-white/80 transition-colors">
                    <ChevronRight className="h-4 w-4 text-white/20" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register?plan=free" className="h-14 w-full rounded-2xl border border-white/10 flex items-center justify-center font-bold text-sm text-white hover:bg-white hover:text-black transition-all duration-500">
                {t('Pricing.hobby.cta')}
              </Link>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -15 }}
            className="group relative rounded-3xl bg-white p-12 transition-all overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.1)]"
          >
            <div className="relative z-10 flex flex-col h-full text-black">
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">{t('Pricing.pro.name')}</span>
                  <span className="px-2 py-1 rounded-md bg-black text-white text-[9px] font-bold uppercase tracking-wider">{t('Pricing.pro.popular')}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tighter">{t('Pricing.pro.price')}</span>
                  <span className="text-black/30 text-sm">{t('Pricing.pro.frequency')}</span>
                </div>
              </div>
              <div className="space-y-6 mb-12 flex-1">
                {(t.raw('Pricing.pro.features') as string[]).map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-black/60">
                    <ChevronRight className="h-4 w-4 text-black/20" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/register?plan=pro" className="h-14 w-full rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm hover:bg-black/90 transition-all shadow-xl">
                {t('Pricing.pro.cta')}
              </Link>
            </div>
            {/* Dynamic light effect on the Pro card */}
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-black/[0.03] rotate-12 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
