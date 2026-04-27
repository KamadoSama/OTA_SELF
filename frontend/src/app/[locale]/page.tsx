"use client";

import { ArrowRight, ChevronRight, CloudLightning, Code, ExternalLink, Shield, Zap, Clock, XCircle, CheckCircle, ChevronDown, Terminal, Server, Smartphone, Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales } from '@/i18n/config';


function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <h4 className="text-lg font-medium text-white/80 group-hover:text-white transition-colors">{question}</h4>
        <div className={`ml-4 w-8 h-8 rounded-full glass flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="h-4 w-4 text-white/50 group-hover:text-white" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-white/40 leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
}

function CodeDemo() {
  const [activeTab, setActiveTab] = useState<'terminal' | 'config'>('terminal');

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-black/40 backdrop-blur-xl">
      {/* Header Tabs */}
      <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-4">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`text-xs font-mono px-3 py-1 rounded-md transition-all duration-300 ${activeTab === 'terminal' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          terminal
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`text-xs font-mono px-3 py-1 rounded-md transition-all duration-300 ${activeTab === 'config' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          app.json
        </button>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-sm leading-relaxed h-[280px] overflow-y-auto overflow-x-hidden">
        {activeTab === 'terminal' ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-white/50 mb-2">$ npx zenota-cli publish</div>
            <div className="text-blue-400 mb-1">ℹ Building Expo bundle...</div>
            <div className="text-white/70 mb-1">✓ JavaScript bundle (iOS/Android) created</div>
            <div className="text-white/70 mb-1">✓ Assets processed and hashed</div>
            <div className="text-blue-400 mb-1">ℹ Uploading to ZenOTA Edge Network...</div>
            <div className="text-white/70 mb-4">✓ Upload complete (4.2MB)</div>
            <div className="text-green-400 font-bold">✨ Success! Update v1.0.4 is now live.</div>
            <div className="text-white/50 mt-2 flex items-center gap-2">
              <span className="text-blue-400">~/my-expo-app</span>
              <span className="w-2 h-4 bg-white/80 animate-pulse inline-block" />
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-white/70">
            <pre>
              <code className="text-[13px] leading-relaxed">
                {`{
  "expo": {
    "name": "my-expo-app",
    "updates": {
      "url": "https://api-zenota.diesestudio.com/api/update/manifest/{your-app-slug}"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}`}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkflowVisual() {
  const t = useTranslations('Workflow');
  return (
    <div className="relative w-full max-w-5xl mx-auto py-10 md:py-20 px-4">
      {/* Desktop Version */}
      <div className="hidden md:block relative h-[300px] overflow-hidden">
        {/* Background SVG for lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
          {/* Connection 1 to 2 */}
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
          {/* Connection 2 to 3 */}
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
          {/* Splitting from 3 to 4 (iOS) and 5 (Android) */}
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

          {/* Flowing Current Effects */}
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
          {/* Step 1: Dev */}
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
              <div className="text-sm font-bold">{t('step1.title')}</div>
            </motion.div>
          </div>

          {/* Step 2: CLI */}
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
              <div className="text-sm font-bold">{t('step2.title')}</div>
            </motion.div>
          </div>

          {/* Step 3: CDN */}
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
              <div className="text-sm font-bold">{t('step3.title')}</div>
            </motion.div>
          </div>

          {/* Step 4: Users (Split) */}
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
                <div className="text-[11px] font-bold">{t('iosUsers')}</div>
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
                <div className="text-[11px] font-bold">{t('androidUsers')}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden flex flex-col items-center relative py-10">
        {/* Step 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[280px] glass p-6 rounded-2xl border border-white/10 text-center"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Terminal className="h-5 w-5 text-white/60" />
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 1</div>
          <div className="text-base font-bold">{t('step1.title')}</div>
        </motion.div>

        {/* Line 1-2 */}
        <div className="h-16 w-px bg-white/10 relative overflow-hidden my-2">
          <motion.div
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-[-1px] w-[3px] h-10 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 shadow-[0_0_8px_#fff]"
          />
        </div>

        {/* Step 2 */}
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 2</div>
          <div className="text-base font-bold">{t('step2.title')}</div>
        </motion.div>

        {/* Line 2-3 */}
        <div className="h-16 w-px bg-white/10 relative overflow-hidden my-2">
          <motion.div
            initial={{ top: "-100%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            className="absolute left-[-1px] w-[3px] h-10 bg-gradient-to-b from-transparent via-white to-transparent opacity-40 shadow-[0_0_8px_#fff]"
          />
        </div>

        {/* Step 3 */}
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t('stepLabel')} 3</div>
          <div className="text-base font-bold">{t('step3.title')}</div>
        </motion.div>

        {/* Line 3-4 (Split) */}
        <div className="h-20 w-full max-w-[280px] relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
            {/* Background Paths */}
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
            {/* Flow Pulses */}
            <motion.path
              d="M 140 0 L 140 30 L 60 80"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="20 60"
              animate={{ strokeDashoffset: [0, -80] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="opacity-40 [filter:drop-shadow(0_0_3px_#fff)]"
            />
            <motion.path
              d="M 140 0 L 140 30 L 220 80"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="20 60"
              animate={{ strokeDashoffset: [0, -80] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              className="opacity-40 [filter:drop-shadow(0_0_3px_#fff)]"
            />
          </svg>
        </div>

        {/* Step 4: Users */}
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
            <div className="text-xs font-bold">{t('iosUsers')}</div>
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
            <div className="text-xs font-bold">{t('androidUsers')}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  const t = useTranslations();
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-30px] rounded-full border border-white/10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-[-60px] rounded-full border border-white/5"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Logo size={64} className="relative z-10" />
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 flex flex-col items-center gap-4"
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
          {t('Loading.initializing')}
        </div>
        <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === 'true';

  useEffect(() => {
    if (isSelfHosted) {
      router.replace('/dashboard');
    }
  }, [isSelfHosted, router]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="noise" />

      {/* Ambient Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse-soft"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-soft"
          style={{ animationDelay: '-2s' }}
        />
        <div
          className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-white/[0.02] blur-[150px] animate-pulse-soft"
          style={{ animationDelay: '-4s' }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size={32} className="group-hover:scale-110" />
            <span className="text-xl font-bold tracking-tight">ZenOTA</span>
          </div>

          <nav className="hidden lg:flex items-center gap-12">
            <a
              href="#features"
              className="text-sm font-medium text-white/40 hover:text-white transition-all hover:tracking-widest duration-300"
            >
              {t('Common.features')}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-white/40 hover:text-white transition-all hover:tracking-widest duration-300"
            >
              {t('Common.pricing')}
            </a>
            <Link href="/docs" className="text-sm font-medium text-white flex items-center gap-1.5 group">
              {t('Common.docs')}
              <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-8">
              <LanguageSwitcher />
              <Link href="/login" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Common.login')}</Link>
              <Link href="/register" className="glass h-12 px-6 flex items-center justify-center rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 active:scale-95">
                {t('Common.signup')}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-3">
              <Link href="/register" className="glass h-9 px-4 flex items-center justify-center rounded-full text-[10px] font-bold hover:bg-white hover:text-black transition-all">
                {t('Common.signup')}
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white relative z-[60]"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-black/40 border-l border-white/10 backdrop-blur-3xl p-8  flex flex-col"
            >
              {/* Header Logo (Mobile Only) */}
            <div className="flex items-center justify-end mb-12">
            
              
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white relative z-[60] border border-white/10 hover:bg-white hover:text-black transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>  
              <nav className="flex flex-col gap-8 mb-12">
                <a
                  href="#features"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-white/60 hover:text-white transition-colors"
                >
                  {t('Common.features')}
                </a>
                <a
                  href="#pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-white/60 hover:text-white transition-colors"
                >
                  {t('Common.pricing')}
                </a>
                <Link 
                  href="/docs" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-white/60 hover:text-white transition-colors flex items-center gap-2"
                >
                  {t('Common.docs')}
                  <ExternalLink className="h-5 w-5 opacity-40" />
                </Link>
              </nav>

              <div className="mt-auto space-y-8">
                <div className="flex flex-col gap-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-2">
                    {t('Common.language')}
                  </div>
                  <div className="flex gap-2">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          router.replace(pathname, { locale: l });
                          setIsMenuOpen(false);
                        }}
                        className={`flex-1 h-12 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                          locale === l 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/5 text-white/40 border-white/10'
                        }`}
                      >
                        {l === 'fr' ? 'Français' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="h-14 rounded-2xl glass flex items-center justify-center text-lg font-bold"
                  >
                    {t('Common.login')}
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMenuOpen(false)}
                    className="h-14 rounded-2xl bg-white text-black flex items-center justify-center text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    {t('Common.signup')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative md:pt-60 pt-20 pb-10 px-6 z-10 overflow-hidden">
        <div className="container relative flex flex-col items-center">
          {/* Zen Orb Element */}
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
            className="text-7xl md:text-[120px] font-black tracking-[-0.06em] text-center leading-[0.85] mb-12"
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
            className="flex flex-col  items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="h-14 px-10 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                {t('Common.getStarted')}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/docs" className="h-14  px-10 rounded-full glass text-white font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                {t('Common.documentation')}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="h-14 px-8 rounded-full glass flex items-center gap-4 text-white/40 font-mono text-sm group cursor-pointer hover:border-white/20 transition-all">
              <span className="text-white/20 select-none">$</span>
              <span>npm i -g zenota-cli</span>
              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Code className="h-3 w-3 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Banner */}
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

      {/* Problem Section */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="container max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{t.rich('Problem.title', { span: (chunks) => <span className="text-white">{chunks}</span> })}</h2>
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

      {/* Workflow Section */}
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
            <p className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{t('Workflow.title')}</p>
          </motion.div>
          
          <WorkflowVisual />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold">1. {t('Workflow.step1.title')}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step1.desc')}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">2. {t('Workflow.step2.title')}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step2.desc')}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">3. {t('Workflow.step3.title')}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{t('Workflow.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
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
            <p className="text-4xl font-bold tracking-tight">{t.rich('Features.title', { lb: (chunks) => <br /> })}</p>
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
                <h3 className="text-3xl font-bold mb-4">{t('Features.instant.title')}</h3>
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
              {/* Background visual decoration */}
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
              <h3 className="text-xl font-bold mb-3">{t('Features.security.title')}</h3>
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
              <h3 className="text-xl font-bold mb-3">{t('Features.cli.title')}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                {t('Features.cli.desc')}
              </p>
            </motion.div>

            {/* Bottom Large Feature */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
              <div className="flex flex-col md:flex-row gap-12 items-center h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{t('Features.runtime.title')}</h3>
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
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 relative z-10 border-t border-white/5">
        <div className="container max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('FAQ.title')}</h2>
            <p className="text-white/40 font-medium text-lg">{t('FAQ.subtitle')}</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="flex flex-col"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question={t('FAQ.q1.q')}
                answer={t('FAQ.q1.a')}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question={t('FAQ.q2.q')}
                answer={t('FAQ.q2.a')}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question={t('FAQ.q3.q')}
                answer={t('FAQ.q3.a')}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
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
                    <span className="text-6xl font-bold tracking-tighter">{t('Pricing.hobby.price')}</span>
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
                <Link href="/register?plan=free" className="h-14 w-full rounded-2xl border border-white/10 flex items-center justify-center font-bold text-sm hover:bg-white hover:text-black transition-all duration-500">
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

      {/* Footer */}
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
              <div className="flex items-center gap-3 font-bold text-xl">
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
                <Link href="/docs" className="text-sm font-medium text-white/40 hover:text-white transition-colors">{t('Common.documentation')}</Link>
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
    </div>
  </>
);
}
