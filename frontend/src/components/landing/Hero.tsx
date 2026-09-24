"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Code, CloudLightning, Shield, Zap } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { CodeDemo } from './CodeDemo';

export function Hero() {
  const t = useTranslations();

  return (
    <>
      <section className="relative md:pt-60 pt-20 pb-10 px-6 z-10 overflow-hidden">
        <div className="container relative flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] border border-white/[0.03] rounded-full -z-10 animate-pulse-soft" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] border border-white/[0.05] rounded-full -z-10" 
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-12"
          >
            <Logo size={14} className="rounded-sm" />
            {t('Hero.badge')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-7xl md:text-[120px] font-black tracking-[-0.06em] text-center leading-[0.85] mb-12 text-white"
          >
            {t('Hero.title1')} <br />
            <span className="text-white/20 italic font-light tracking-tight">{t('Hero.title2')}</span> {t('Hero.title3')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/30 max-w-2xl text-center mb-16 leading-relaxed font-medium"
          >
            {t('Hero.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="h-14 px-10 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                {t('Common.getStarted')}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/docs" className="h-14 px-10 rounded-full glass text-white font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                {t('Common.documentation')}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
              <div className="h-11 px-5 rounded-full glass flex items-center gap-3 text-white/50 group cursor-pointer hover:border-white/30 transition-all">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-white/80">npm i -g zenota-cli</span>
              </div>
              <span className="text-white/20">or</span>
              <div className="h-11 px-5 rounded-full glass flex items-center gap-3 text-white/50 group cursor-pointer hover:border-white/30 transition-all">
                <span className="text-blue-400 font-bold">$</span>
                <span className="text-white/80">curl -fsSL get-zenota.diesestudio.com | sh</span>
              </div>
            </div>

            {/* Interactive Terminal Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-full mt-6 flex justify-center"
            >
              <CodeDemo />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02] py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <CloudLightning className="h-4 w-4 text-white/20" /> {t('Metrics.latency')}
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Shield className="h-4 w-4 text-white/20" /> {t('Metrics.signing')}
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Zap className="h-4 w-4 text-white/20" /> {t('Metrics.uptime')}
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Code className="h-4 w-4 text-white/20" /> {t('Metrics.config')}
          </div>
        </motion.div>
      </section>
    </>
  );
}
