"use client";

import { ChevronRight, Zap, Code, Shield, CloudLightning, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false); // Reset to ensure animation triggers if needed, but standard React life cycle is enough
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black relative">
      {/* Texture background: Dot Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/[0.08] backdrop-blur-md bg-black/50">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium tracking-tight">
            <div className="w-7 h-7 rounded bg-white flex items-center justify-center">
               <CloudLightning className="h-4 w-4 text-black fill-black" />
            </div>
            <span className="text-lg">ZenOTA</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium text-white/50">
            <a href="#features" className="hover:text-white transition-colors tracking-wide">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors tracking-wide">Pricing</a>
            <Link href="/docs" className="hover:text-white transition-colors tracking-wide flex items-center gap-1.5 text-white">Documentation <ExternalLink className="h-3 w-3" /></Link>
          </nav>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[13px] font-medium text-white/50 hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="text-[13px] font-bold bg-white text-black px-4 py-1.5 rounded hover:bg-white/90 transition-all">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 z-10">
        <div className="container mx-auto max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-white/5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60 mb-10">
             Available for Expo SDK 50+
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] text-white mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 leading-[0.9]">
            The standard for <br/>Expo updates.
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 max-w-xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 font-medium">
            Push instant over-the-air updates to iOS and Android. <br/>Predictable pricing. Zero infra management.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Link href="/docs" className="h-12 px-8 rounded bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Get Started for Free
            </Link>
            <div className="h-12 px-6 rounded border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-3 text-white/60 font-mono text-[13px] hover:border-white/20 transition-colors group cursor-text">
              <span className="text-white/30">$</span> npm i -g zenota-cli
              <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-white/[0.05]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
             {/* Feature 1 */}
            <div className="md:col-span-2 rounded border border-white/[0.08] bg-white/[0.02] p-10 hover:bg-white/[0.04] transition-all group overflow-hidden relative">
               <Zap className="h-6 w-6 text-white mb-6" />
               <h3 className="text-2xl font-bold mb-4 tracking-tight">Instant Deployment</h3>
               <p className="text-white/40 leading-relaxed font-medium">Your component changes and JS bundles are delivered immediately to your users. Skip the App Store review cycles and ship features or hotfixes in seconds.</p>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-colors" />
            </div>
            
            {/* Feature 2 */}
             <div className="rounded border border-white/[0.08] bg-white/[0.02] p-10 hover:bg-white/[0.04] transition-all">
               <Code className="h-6 w-6 text-white mb-6" />
               <h3 className="text-xl font-bold mb-4 tracking-tight">Pro CLI</h3>
               <p className="text-white/40 text-[15px] font-medium">Simple as <code className="text-white">zenota publish</code>. We handle the export, compression, and global distribution for you.</p>
            </div>
            
            {/* Feature 3 */}
             <div className="rounded border border-white/[0.08] bg-white/[0.02] p-10 hover:bg-white/[0.04] transition-all">
               <Shield className="h-6 w-6 text-white mb-6" />
               <h3 className="text-xl font-bold mb-4 tracking-tight">Secure & Signed</h3>
               <p className="text-white/40 text-[15px] font-medium">Every asset and bundle is cryptographically signed. Updates are only applied if they pass integrity checks.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="md:col-span-2 rounded border border-white/[0.08] bg-white/[0.02] p-10 hover:bg-white/[0.04] transition-all flex flex-col justify-center">
               <h3 className="text-2xl font-bold mb-4 tracking-tight">Native-First Performance</h3>
               <p className="text-white/40 font-medium">Built-in support for Expo SDK. ZenOTA reuses your existing native builds without increasing your app size with heavy dependencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-6 border-t border-white/[0.05] relative bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Fair Pricing</h2>
          <p className="text-white/40 mb-20 max-w-xl mx-auto font-medium">Stop paying for unpredictable bandwidth. One flat rate for everything you need.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08] border border-white/[0.08] rounded-lg overflow-hidden max-w-3xl mx-auto text-left">
            {/* Free */}
            <div className="bg-black p-12 flex flex-col">
               <div className="mb-10">
                 <h3 className="text-lg font-bold text-white/50 mb-2 uppercase tracking-widest text-xs">Hobby</h3>
                 <div className="flex items-baseline gap-1">
                   <span className="text-5xl font-bold tracking-tighter">$0</span>
                   <span className="text-white/30 text-sm">/month</span>
                 </div>
               </div>
               <ul className="space-y-5 mb-12 flex-1">
                 <li className="flex gap-3 text-sm font-medium text-white/60"><ChevronRight className="h-4 w-4 text-white shrink-0" />1 Active Expo App</li>
                 <li className="flex gap-3 text-sm font-medium text-white/60"><ChevronRight className="h-4 w-4 text-white shrink-0" />10 Deployments / day</li>
                 <li className="flex gap-3 text-sm font-medium text-white/60"><ChevronRight className="h-4 w-4 text-white shrink-0" />Standard Support</li>
               </ul>
               <Link href="/register" className="w-full h-11 flex items-center justify-center rounded border border-white/10 font-bold text-[13px] hover:bg-white/5 transition-colors">Start Free</Link>
            </div>
            
            {/* Pro */}
             <div className="bg-[#080808] p-12 flex flex-col relative group">
               {/* Subtle border effect on hover */}
               <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
               <div className="mb-10">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest text-xs">Professional</h3>
                 </div>
                 <div className="flex items-baseline gap-1">
                   <span className="text-5xl font-bold tracking-tighter">$19</span>
                   <span className="text-white/30 text-sm">/month</span>
                 </div>
               </div>
               <ul className="space-y-5 mb-12 flex-1">
                 <li className="flex gap-3 text-sm font-medium text-white"><ChevronRight className="h-4 w-4 text-white shrink-0" />Unlimited Apps</li>
                 <li className="flex gap-3 text-sm font-medium text-white"><ChevronRight className="h-4 w-4 text-white shrink-0" />Unlimited Deployments</li>
                 <li className="flex gap-3 text-sm font-medium text-white"><ChevronRight className="h-4 w-4 text-white shrink-0" />Priority CDN Delivery</li>
                 <li className="flex gap-3 text-sm font-medium text-white"><ChevronRight className="h-4 w-4 text-white shrink-0" />Advanced CLI Analytics</li>
               </ul>
               <Link href="/register" className="w-full h-11 flex items-center justify-center rounded bg-white text-black font-bold text-[13px] hover:bg-white/90 transition-colors">Go Professional</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-20 px-6 bg-black relative z-10">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 font-medium text-white/40">
               <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                  <CloudLightning className="h-3 w-3 text-white" />
               </div>
               <span>ZenOTA © 2024</span>
            </div>
            <div className="flex gap-10 text-[13px] font-medium text-white/30">
               <a href="#" className="hover:text-white transition-colors">GitHub</a>
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Status</a>
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
         </div>
      </footer>

    </div>
  );
}
