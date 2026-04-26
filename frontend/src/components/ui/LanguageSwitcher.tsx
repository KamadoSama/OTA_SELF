'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français'
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="glass h-10 px-4 flex items-center gap-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all border border-white/10 group"
      >
        <Globe className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
        <span className="uppercase tracking-wider text-xs font-bold text-white/80 group-hover:text-white transition-colors">
          {locale}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div key="language-switcher-wrapper">
            <motion.div 
              key="language-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }} 
            />
            <motion.div
              key="language-menu"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-32 glass border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
            >
              <div className="p-1">
                {locales.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLocale(l);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      locale === l 
                        ? 'bg-white text-black' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {languageNames[l]}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
