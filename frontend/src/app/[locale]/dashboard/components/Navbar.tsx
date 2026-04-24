"use client";

import { CloudLightning, RefreshCw, LogOut, Loader2, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

interface NavbarProps {
  isLoading?: boolean;
  isLoggingOut?: boolean;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export function Navbar({
  isLoading = false,
  isLoggingOut = false,
  onRefresh,
  onLogout
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const tabs = [
    { id: 'overview', label: 'Overview', href: '/dashboard' },
    { id: 'subscription', label: 'Subscription', href: '/dashboard/subscription' },
    { id: 'billing', label: 'Billing', href: '/dashboard/billing' },
    { id: 'settings', label: 'Settings', href: '/dashboard/settings' },
  ] as const;

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <CloudLightning className="h-3.5 w-3.5 text-black fill-black" />
            </div>
            <span className="text-sm font-bold tracking-tight">ZenOTA</span>
          </Link>
          
          <div className="hidden h-4 w-px bg-white/10 md:block" />
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-white/40">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`${isActive(tab.href) ? 'text-white' : 'hover:text-white transition-colors'}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            System Live
          </div>
          
          <div className="hidden h-4 w-px bg-white/10 sm:block" />
          
          {onRefresh && (
            <button 
              onClick={onRefresh} 
              className="text-white/40 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                posthog.capture("user_logged_out");
                posthog.reset();
                onLogout();
              }}
              disabled={isLoggingOut}
              className="hidden sm:flex items-center gap-2 rounded border border-white/10 px-3 py-1.5 text-[12px] font-bold hover:bg-white/[0.05] transition-all"
            >
              {isLoggingOut ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
              Logout
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white/40 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-[#080808] border-b border-white/10 md:hidden animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-4 space-y-4">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-left text-sm font-medium py-2 px-4 rounded ${
                  isActive(tab.href) ? 'bg-white/5 text-white' : 'text-white/40'
                }`}
              >
                {tab.label}
              </Link>
            ))}
            {onLogout && (
              <button
                onClick={() => {
                  posthog.capture("user_logged_out");
                  posthog.reset();
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-500 text-sm font-bold py-2 px-4"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
