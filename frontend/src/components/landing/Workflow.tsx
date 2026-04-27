"use client";

import { motion } from 'framer-motion';
import { Terminal, Zap, Server, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

function WorkflowVisual() {
  const t = useTranslations('Workflow');
  return (
    <div className="relative h-[300px] overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
          <motion.path
            d="M 203 150 L 297 150"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d="M 453 150 L 547 150"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.5 }}
          />
          <motion.path
            d="M 703 150 C 750 150, 750 106, 805 106"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2 }}
          />
          <motion.path
            d="M 703 150 C 750 150, 750 194, 805 194"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 2 }}
          />

          <motion.path
            d="M 203 150 L 297 150"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="30 60"
            animate={{ strokeDashoffset: [0, -90] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="opacity-60 [filter:drop-shadow(0_0_3px_#fff)]"
          />
          <motion.path
            d="M 453 150 L 547 150"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="30 60"
            animate={{ strokeDashoffset: [0, -90] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
            className="opacity-60 [filter:drop-shadow(0_0_3px_#fff)]"
          />
          <motion.path
            d="M 703 150 C 750 150, 750 106, 805 106"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="30 60"
            animate={{ strokeDashoffset: [0, -90] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
            className="opacity-60 [filter:drop-shadow(0_0_3px_#fff)]"
          />
          <motion.path
            d="M 703 150 C 750 150, 750 194, 805 194"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeDasharray="30 60"
            animate={{ strokeDashoffset: [0, -90] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
            className="opacity-60 [filter:drop-shadow(0_0_3px_#fff)]"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-4 gap-0 items-center h-full">
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-40 glass p-4 rounded-2xl border border-white/10 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Terminal className="h-5 w-5 text-white/60" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 1</div>
              <div className="text-sm font-bold text-white">{t('step1.title')}</div>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="w-40 glass p-4 rounded-2xl border border-white/20 bg-white/[0.03] text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-3 shadow-xl">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 2</div>
              <div className="text-sm font-bold text-white">{t('step2.title')}</div>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.6 }}
              className="w-40 glass p-4 rounded-2xl border border-white/10 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <Server className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 3</div>
              <div className="text-sm font-bold text-white">{t('step3.title')}</div>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col gap-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.4 }}
                className="w-36 glass p-3 rounded-xl border border-white/5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4 text-white/40" />
                </div>
                <div className="text-[11px] font-bold text-white">{t('iosUsers')}</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.6 }}
                className="w-36 glass p-3 rounded-xl border border-white/5 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Smartphone className="h-4 w-4 text-white/40" />
                </div>
                <div className="text-[11px] font-bold text-white">{t('androidUsers')}</div>
              </motion.div>
            </div>
          </div>
        </div>
    </div>
  );
}

export function Workflow() {
  const t = useTranslations();
  
  return (
    <section className="py-24 px-6 relative z-10 border-t border-white/5">
      <div className="container max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">{t('Workflow.pipeline')}</h2>
          <p className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">{t('Workflow.title')}</p>
        </motion.div>
        
        {/* Desktop Visual */}
        <div className="hidden md:block">
          <WorkflowVisual />
        </div>

        {/* Mobile Version */}
        <div className="md:hidden flex flex-col items-center relative py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-[280px] glass p-6 rounded-2xl border border-white/10 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <Terminal className="h-5 w-5 text-white/60" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('Workflow.stepLabel')} 1</div>
            <div className="text-base font-bold text-white">{t('Workflow.step1.title')}</div>
          </motion.div>

          <div className="h-16 w-px bg-white/10 relative overflow-hidden my-2">
            <motion.div
              initial={{ top: "-100%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-[-1px] w-[3px] h-10 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 shadow-[0_0_8px_#fff]"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-[280px] glass p-6 rounded-2xl border border-white/20 bg-white/[0.03] text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center mx-auto mb-3 shadow-xl">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('Workflow.stepLabel')} 2</div>
            <div className="text-base font-bold text-white">{t('Workflow.step2.title')}</div>
          </motion.div>

          <div className="h-16 w-px bg-white/10 relative overflow-hidden my-2">
            <motion.div
              initial={{ top: "-100%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
              className="absolute left-[-1px] w-[3px] h-10 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 shadow-[0_0_8px_#fff]"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-[280px] glass p-6 rounded-2xl border border-white/10 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
              <Server className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('Workflow.stepLabel')} 3</div>
            <div className="text-base font-bold text-white">{t('Workflow.step3.title')}</div>
          </motion.div>

          <div className="h-20 w-full max-w-[280px] relative">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
              <motion.path
                d="M 140 0 L 140 30 L 60 80"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                fill="none"
              />
              <motion.path
                d="M 140 0 L 140 30 L 220 80"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          <div className="flex flex-row gap-4 w-full max-w-[280px]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="w-full glass p-4 rounded-xl border border-white/5 flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Smartphone className="h-4 w-4 text-white/40" />
              </div>
              <div className="text-xs font-bold text-white">{t('Workflow.iosUsers')}</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="w-full glass p-4 rounded-xl border border-white/5 flex items-center gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Smartphone className="h-4 w-4 text-white/40" />
              </div>
              <div className="text-xs font-bold text-white">{t('Workflow.androidUsers')}</div>
            </motion.div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">1. {t('Workflow.step1.title')}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step1.desc')}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">2. {t('Workflow.step2.title')}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step2.desc')}</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">3. {t('Workflow.step3.title')}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step3.desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
