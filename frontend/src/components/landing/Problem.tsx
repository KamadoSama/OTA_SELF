"use client";

import { motion } from 'framer-motion';
import { Clock, XCircle, Zap, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Problem() {
  const t = useTranslations();

  return (
    <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-white/[0.01]">
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            {t.rich('Problem.title', { span: (chunks) => <span className="text-white">{chunks}</span> })}
          </h2>
          <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            {t('Problem.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* The Old Way */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass rounded-3xl p-8 border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-bold text-white/50 mb-6 flex items-center gap-3">
              <Clock className="h-5 w-5 text-white/30" />
              {t('Problem.oldWay')}
            </h3>
            <ul className="space-y-4">
              {(t.raw('Problem.oldSteps') as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/40">
                  <XCircle className="h-5 w-5 text-white/20 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The ZenOTA Way */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-3xl p-8 border border-white/20 relative overflow-hidden bg-white/[0.03]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="h-5 w-5 text-white" />
              {t('Problem.zenotaWay')}
            </h3>
            <ul className="space-y-4">
              {(t.raw('Problem.zenotaSteps') as string[]).map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 font-medium">
                  <CheckCircle className="h-5 w-5 text-white shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
