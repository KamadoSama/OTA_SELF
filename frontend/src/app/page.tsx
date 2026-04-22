"use client";

import { ArrowRight, ChevronRight, CloudLightning, Code, ExternalLink, Shield, Zap, Clock, XCircle, CheckCircle, ChevronDown, Terminal, Server, Smartphone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

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
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 1</div>
              <div className="text-sm font-bold">Local Changes</div>
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
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 2</div>
              <div className="text-sm font-bold">zenota publish</div>
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
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 3</div>
              <div className="text-sm font-bold">Edge Network</div>
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
                <div className="text-[11px] font-bold">iOS Users</div>
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
                <div className="text-[11px] font-bold">Android Users</div>
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 1</div>
          <div className="text-base font-bold">Local Changes</div>
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 2</div>
          <div className="text-base font-bold">zenota publish</div>
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Step 3</div>
          <div className="text-base font-bold">Edge Network</div>
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
            <div className="text-xs font-bold">iOS Users</div>
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
            <div className="text-xs font-bold">Android Users</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
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
          Initializing ZenOTA
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
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <Logo size={32} className="group-hover:scale-110" />
            <span className="text-xl font-bold tracking-tight">ZenOTA</span>
          </div>

          <nav className="hidden md:flex items-center gap-12">
            {['Features', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/40 hover:text-white transition-all hover:tracking-widest duration-300"
              >
                {item}
              </a>
            ))}
            <Link href="/docs" className="text-sm font-medium text-white flex items-center gap-1.5 group">
              Docs
              <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </nav>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="glass h-10 px-6 flex items-center justify-center rounded-full text-sm font-bold hover:bg-white hover:text-black transition-all duration-500 hover:scale-105 active:scale-95">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

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
            Optimized for Expo SDK 50+
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-7xl md:text-[120px] font-black tracking-[-0.06em] text-center leading-[0.85] mb-12"
          >
            Ship updates <br />
            <span className="text-white/20 italic font-light tracking-tight">in a state of</span> Zen.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/30 max-w-2xl text-center mb-16 leading-relaxed font-medium"
          >
            The high-performance OTA infrastructure for React Native. <br className="hidden md:block" />
            Bypass review cycles. Deploy instantly. Scale infinitely.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col  items-center gap-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="h-14 px-10 rounded-full bg-white text-black font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/docs" className="h-14  px-10 rounded-full glass text-white font-bold text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]">
                Documentation
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
            <CloudLightning className="h-4 w-4 text-white/20" /> 50ms Edge Latency
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Shield className="h-4 w-4 text-white/20" /> End-to-End Signing
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Zap className="h-4 w-4 text-white/20" /> 99.99% Uptime SLA
          </div>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3 text-white/40 font-medium uppercase tracking-widest text-xs">
            <Code className="h-4 w-4 text-white/20" /> Zero Native Config
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">The App Store waiting game is <span className="text-white">over.</span></h2>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Shipping a typo fix shouldn't take 3 days of review. Bypass the bureaucracy and deliver updates directly to your users' devices.
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
                The Old Way
              </h3>
              <ul className="space-y-4">
                {['Build native binaries (AAB/IPA)', 'Upload to App Store / Play Store', 'Wait for manual review (1-3 days)', 'Users must manually download update'].map((item, i) => (
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
                The ZenOTA Way
              </h3>
              <ul className="space-y-4">
                {['Make code changes in JS/TS', 'Run `zenota publish`', 'Updates distributed via Global Edge CDN', 'Users get the update instantly on next launch'].map((item, i) => (
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
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">The Pipeline</h2>
            <p className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Zero friction deployment.</p>
          </motion.div>
          
          <WorkflowVisual />

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold">1. Configure</h4>
              <p className="text-white/40 text-sm leading-relaxed">Add the ZenOTA URL to your app.json. It takes less than 30 seconds to set up.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">2. Publish</h4>
              <p className="text-white/40 text-sm leading-relaxed">Run the command. We bundle, hash, and upload your assets to our global edge network.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold">3. Update</h4>
              <p className="text-white/40 text-sm leading-relaxed">Users receive the update on the next launch. No App Store delays, no user action required.</p>
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
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Infrastructure</h2>
            <p className="text-4xl font-bold tracking-tight">Built for speed. <br /> Designed for developers.</p>
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
                <h3 className="text-3xl font-bold mb-4">Instant Edge Delivery</h3>
                <p className="text-white/40 text-lg max-w-md leading-relaxed font-medium">
                  We ship your JS bundles across a global edge network. Your users get updates in milliseconds, not minutes.
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
              <h3 className="text-xl font-bold mb-3">Military-Grade Security</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                End-to-end cryptographic signing ensures that only your authorized code ever runs on your users' devices.
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
              <h3 className="text-xl font-bold mb-3">Intuitive CLI</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                A command-line experience that feels like magic. <code className="text-white/60">zenota publish</code> is all you need.
              </p>
            </motion.div>

            {/* Bottom Large Feature */}
            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }} className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
              <div className="flex flex-col md:flex-row gap-12 items-center h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">Native-First Runtime</h3>
                  <p className="text-white/40 text-lg leading-relaxed font-medium">
                    Zero overhead. ZenOTA leverages the native Expo Updates runtime you already trust, without adding bloat.
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
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-white/40 font-medium text-lg">Everything you need to know about ZenOTA.</p>
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
                question="Do I need to eject my Expo app?"
                answer="No! ZenOTA works seamlessly with managed Expo workflows. It uses the exact same `expo-updates` library you already have installed. You just point the configuration to our servers in your app.json."
              />
            </motion.div>
            {/* <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question="Is ZenOTA a replacement for EAS Update?"
                answer="Yes. ZenOTA provides the same core functionality as EAS Update but is optimized for speed, simplicity, and affordability. Our CLI and infrastructure are built to get your bundles to users as fast as possible without complex workflows."
              />
            </motion.div> */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question="What happens if an update crashes my app?"
                answer="By default, the Expo Updates runtime will detect a fatal crash on startup and automatically roll back to the previously embedded bundle, ensuring your users are never stuck on a broken screen."
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <FAQItem
                question="What is considered a 'Deployment'?"
                answer="A deployment is a single push of a new bundle (using `zenota publish`). If you publish an update for both iOS and Android simultaneously, it counts as one deployment. There are no limits on how many users can download your updates."
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
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Elite Infrastructure. <br /> Fair Pricing.</h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium">One flat rate. Unlimited possibilities. Scale your Expo apps without the bandwidth tax.</p>
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block mb-4">Hobby</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold tracking-tighter">$0</span>
                    <span className="text-white/20 text-sm">/mo</span>
                  </div>
                </div>
                <div className="space-y-6 mb-12 flex-1">
                  {['1 Active Project', '2 Deployments per day', 'Community Support', 'Standard Edge Delivery'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/50 group-hover:text-white/80 transition-colors">
                      <ChevronRight className="h-4 w-4 text-white/20" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/register?plan=free" className="h-14 w-full rounded-2xl border border-white/10 flex items-center justify-center font-bold text-sm hover:bg-white hover:text-black transition-all duration-500">
                  Start Free
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
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">Professional</span>
                    <span className="px-2 py-1 rounded-md bg-black text-white text-[9px] font-bold uppercase tracking-wider">Most Popular</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold tracking-tighter">$19</span>
                    <span className="text-black/30 text-sm">/mo</span>
                  </div>
                </div>
                <div className="space-y-6 mb-12 flex-1">
                  {['Unlimited Projects', 'Unlimited Deployments', 'Priority CDN Support', 'Advanced CLI Analytics', 'Team Management'].map(item => (
                    <div key={item} className="flex items-center gap-3 text-sm font-bold text-black/60">
                      <ChevronRight className="h-4 w-4 text-black/20" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link href="/register?plan=pro" className="h-14 w-full rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm hover:bg-black/90 transition-all shadow-xl">
                  Go Professional
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
                The enterprise-grade standard for Expo updates. Built for performance, security, and developer joy.
              </p>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/10">
                ZenOTA © 2024 • Developed by KamadoSama
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Product</span>
                <a href="#features" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Features</a>
                <a href="#pricing" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Pricing</a>
                <Link href="/docs" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Documentation</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Social</span>
                <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Discord</a>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Company</span>
                <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  </>
);
}
