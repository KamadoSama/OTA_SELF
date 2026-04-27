"use client";

import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="py-20 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="container"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 pt-20 border-t border-white/5">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 font-bold text-xl text-white">
              <Logo size={32} />
              ZenOTA
            </div>
            <p className="text-white/20 text-sm max-w-xs font-medium">
              {t('Footer.desc')}
            </p>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/10">
              {t('Footer.developedBy')}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('Footer.product')}</span>
              <a href="#features" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Common.features')}</a>
              <a href="#pricing" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Common.pricing')}</a>
              <Link href="/docs" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Common.docs')}</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('Footer.social')}</span>
              <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Discord</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{t('Footer.company')}</span>
              <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Footer.terms')}</a>
              <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Footer.privacy')}</a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
