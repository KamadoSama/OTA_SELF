"use client";

import { useState, useEffect } from "react";
import { Menu, X, ExternalLink, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslations, useLocale } from 'next-intl';
import { locales } from '@/i18n/config';

export function Header() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);



  const navLinks = [
    { href: "#features", label: t('features') },
    { href: "#pricing", label: t('pricing') },
    { href: "/docs", label: t('docs'), external: true },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo - Floating Pill Left */}
        <div 
          className={`pointer-events-auto glass h-12 px-4 rounded-full flex items-center gap-3 transition-all duration-500 border border-white/10 cursor-pointer ${scrolled ? 'bg-black/60 shadow-xl' : 'bg-white/5'}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Logo size={24} />
          <span className="font-bold tracking-tight text-white">ZenOTA</span>
        </div>

        {/* Desktop Navigation - Center Pill */}
        <div className={`hidden lg:flex pointer-events-auto glass h-12 px-6 rounded-full items-center gap-8 border border-white/10 transition-all duration-500 ${scrolled ? 'bg-black/60 shadow-xl' : 'bg-white/5'}`}>
          {navLinks.map((link) => (
             link.external ? (
              <Link key={link.href} href={link.href} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-1.5">
                {link.label}
                <ExternalLink size={10} />
              </Link>
             ) : (
              <a key={link.href} href={link.href} className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                {link.label}
              </a>
             )
          ))}
        </div>

        {/* Actions - Right Pill */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className={`hidden md:flex glass h-12 px-4 rounded-full items-center gap-6 border border-white/10 transition-all duration-500 ${scrolled ? 'bg-black/60' : 'bg-white/5'}`}>
            <LanguageSwitcher />
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">{t('login')}</Link>
          </div>
          
          <Link href="/register" className="hidden sm:flex h-12 px-6 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl items-center gap-2">
            {t('signup')}
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden w-12 h-12 rounded-full glass flex items-center justify-center text-white border border-white/10 transition-all ${isMenuOpen ? 'bg-white text-black border-white rotate-90' : 'bg-black/40'}`}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Modern Mobile Menu - Simple & Fast */}
      <div
        className={`absolute top-20 inset-x-4 pointer-events-auto lg:hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="glass rounded-[32px] border border-white/10 p-8 shadow-2xl bg-black/90 backdrop-blur-xl">
          <div className="flex flex-col gap-10">
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.external ? (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-black tracking-tighter text-white/40 hover:text-white transition-colors flex items-center gap-4"
                  >
                    {link.label}
                    <ExternalLink size={24} className="opacity-20" />
                  </Link>
                ) : (
                  <a 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-black tracking-tighter text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            <div className="h-px bg-white/5" />

            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                {t('language')}
                <div className="flex gap-4">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        router.replace(pathname, { locale: l });
                        setIsMenuOpen(false);
                      }}
                      className={`transition-colors ${locale === l ? 'text-white' : 'hover:text-white/60'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="h-14 rounded-2xl glass flex items-center justify-center font-bold text-white border border-white/5"
                >
                  {t('login')}
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold"
                >
                  {t('signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
