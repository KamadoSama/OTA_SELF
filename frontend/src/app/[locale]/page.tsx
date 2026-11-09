"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useIsSelfHosted } from "@/hooks/useSelfHosted";

// Landing Components
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Workflow } from '@/components/landing/Workflow';
import { CostCalculator } from '@/components/landing/CostCalculator';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { LoadingScreen } from '@/components/landing/LoadingScreen';

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isSelfHosted = useIsSelfHosted();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (isSelfHosted) {
      if (status === "loading") return;
      if (session?.user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [isSelfHosted, status, session, router]);

  if (!mounted || isSelfHosted) {
    if (isSelfHosted) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-white/40 animate-spin" />
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
        {/* Background Effects */}
        <div className="noise" />
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

        <Header />
        
        <main>
          <Hero />
          <Problem />
          <Workflow />
          <CostCalculator />
          <Features />
          <FAQ />
          <Pricing />
        </main>

        <Footer />
      </div>
    </>
  );
}
