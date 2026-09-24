"use client";

import { motion } from 'framer-motion';
import { Shield, Code, CloudLightning, Zap, SlidersHorizontal, RotateCcw, Server } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useTranslations } from 'next-intl';

export function Features() {
  const t = useTranslations();

  return (
    <section id="features" className="py-24 px-6 relative z-10 border-t border-white/5">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col mb-20"
        >
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">{t('Features.infra')}</h2>
          <p className="text-4xl font-bold tracking-tight text-white">{t.rich('Features.title', { lb: (chunks) => <br /> })}</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* Main Feature */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
            <div className="relative z-10 h-full flex flex-col">
              <Logo size={48} className="rounded-2xl mb-8 shadow-xl" />
              <h3 className="text-3xl font-bold mb-4 text-white">{t('Features.instant.title')}</h3>
              <p className="text-white/40 text-lg max-w-md leading-relaxed font-medium">
                {t('Features.instant.desc')}
              </p>
              <div className="mt-auto pt-12 flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-white/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none" />
          </motion.div>

          {/* Side Feature 1 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
            >
              <Shield className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-white">{t('Features.security.title')}</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              {t('Features.security.desc')}
            </p>
          </motion.div>

          {/* Side Feature 2 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
            >
              <Code className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-white">{t('Features.cli.title')}</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              {t('Features.cli.desc')}
            </p>
          </motion.div>

          {/* Bottom Large Feature */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
            <div className="flex flex-col md:flex-row gap-12 items-center h-full">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 tracking-tight text-white">{t('Features.runtime.title')}</h3>
                <p className="text-white/40 text-lg leading-relaxed font-medium">
                  {t('Features.runtime.desc')}
                </p>
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <CloudLightning className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white mb-1">expo-updates</div>
                    <div className="text-xs text-white/40">Native runtime module</div>
                  </div>
                  <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-white/30" />
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 ml-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white mb-1">ZenOTA Edge</div>
                    <div className="text-xs text-white/40">Manifest & Bundle Delivery</div>
                  </div>
                  <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-transparent to-white/40 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progressive Rollouts Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <SlidersHorizontal className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Canary Rollouts (%)</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Déployez d'abord à 10% ou 25% de votre parc d'appareils de façon déterministe avant de basculer à 100%. Zéro risque de bloquer tous vos utilisateurs.
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">--rollout 25</span>
              <span className="text-[11px] text-white/30">deterministic hashing</span>
            </div>
          </motion.div>

          {/* Instant Rollback Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
              <RotateCcw className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Instant Rollback (200ms)</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Un bug imprévu en production ? Restaurez instantanément la version stable précédente sans attendre un nouveau build d'Expo.
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">zenota rollback</span>
              <span className="text-[11px] text-white/30">0-downtime</span>
            </div>
          </motion.div>

          {/* 100% Self-Hosted Sovereignty Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <Server className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">100% Self-Hosted</h3>
            <p className="text-white/40 text-sm leading-relaxed font-medium">
              Installez ZenOTA sur votre VPS en une ligne de commande. Vos bundles restent dans votre bucket S3/MinIO/R2, sans aucun compteur de MAU.
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2">
              <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">curl | sh</span>
              <span className="text-[11px] text-white/30">Docker & MinIO</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
