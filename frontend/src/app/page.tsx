"use client";

import { ArrowRight, ChevronRight, CloudLightning, Code, ExternalLink, Shield, Zap } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] border border-white/[0.03] rounded-full -z-10 animate-pulse-soft" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] border border-white/[0.05] rounded-full -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Logo size={14} className="rounded-sm" />
            Optimized for Expo SDK 50+
          </div>

          <h1 className="text-7xl md:text-[120px] font-black tracking-[-0.06em] text-center leading-[0.85] mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            Ship updates <br />
            <span className="text-white/20 italic font-light tracking-tight">in a state of</span> Zen.
          </h1>

          <p className="text-xl md:text-2xl text-white/30 max-w-2xl text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed font-medium">
            The high-performance OTA infrastructure for React Native. <br className="hidden md:block" />
            Bypass review cycles. Deploy instantly. Scale infinitely.
          </p>

          <div className="flex flex-col  items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
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
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="px-6 relative z-10">
        <div className="container">
          <div className="flex flex-col mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Infrastructure</h2>
            <p className="text-4xl font-bold tracking-tight">Built for speed. <br /> Designed for developers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main Feature */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
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
            </div>

            {/* Side Feature 1 */}
            <div className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Military-Grade Security</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                End-to-end cryptographic signing ensures that only your authorized code ever runs on your users' devices.
              </p>
            </div>

            {/* Side Feature 2 */}
            <div className="md:col-span-4 group rounded-3xl glass p-10 flex flex-col transition-all hover:bg-white/[0.04]">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Code className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Intuitive CLI</h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                A command-line experience that feels like magic. <code className="text-white/60">zenota publish</code> is all you need.
              </p>
            </div>

            {/* Bottom Large Feature */}
            <div className="md:col-span-8 group relative overflow-hidden rounded-3xl glass p-12 transition-all hover:bg-white/[0.04]">
              <div className="flex flex-col md:flex-row gap-12 items-center h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">Native-First Runtime</h3>
                  <p className="text-white/40 text-lg leading-relaxed font-medium">
                    Zero overhead. ZenOTA leverages the native Expo Updates runtime you already trust, without adding bloat.
                  </p>
                </div>
                <div className="flex-1 w-full grid grid-cols-2 gap-3">
                  <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                    <div className="w-6 h-6 rounded bg-white/10" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                  <div className="h-32 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                    <div className="w-6 h-6 rounded bg-white/10" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-10 px-6 relative">
        <div className="container relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">Elite Infrastructure. <br /> Fair Pricing.</h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium">One flat rate. Unlimited possibilities. Scale your Expo apps without the bandwidth tax.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Hobby Plan */}
            <div className="group relative rounded-3xl glass p-12 transition-all hover:bg-white/[0.04] overflow-hidden">
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
            </div>

            {/* Pro Plan */}
            <div className="group relative rounded-3xl bg-white p-12 transition-all overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.1)] hover:scale-[1.02] duration-500">
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
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 relative z-10">
        <div className="container">
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
        </div>
      </footer>
    </div>
  );
}
