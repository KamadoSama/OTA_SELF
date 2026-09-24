"use client";

import { CloudLightning, RefreshCw, LogOut, Loader2, Menu, X, BookOpen, Key } from "lucide-react";
import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { ProjectSelector } from "./ProjectSelector";
import { CreateAppModal } from "./CreateAppModal";
import { AppSummary } from "@/services/apps.service";
import { useApps } from "@/hooks/useApps";
import { useLogout } from "@/hooks/useAuth";

interface NavbarProps {
  isLoading?: boolean;
  isLoggingOut?: boolean;
  onRefresh?: () => void;
  onLogout?: () => void;
  apps?: AppSummary[];
  selectedApp?: string | null;
  onSelectApp?: (appName: string | null) => void;
  onNewProject?: () => void;
}

export function Navbar({
  isLoading = false,
  isLoggingOut: externalIsLoggingOut,
  onRefresh,
  onLogout: externalOnLogout,
  apps: externalApps,
  selectedApp: externalSelectedApp,
  onSelectApp,
  onNewProject,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: fetchedApps = [], isLoading: isFetchingApps, refetch: refetchApps } = useApps();
  const { mutate: logoutMutate, isPending: internalIsLoggingOut } = useLogout();

  const apps = externalApps && externalApps.length > 0 ? externalApps : fetchedApps;
  const isLoggingOut = externalIsLoggingOut !== undefined ? externalIsLoggingOut : internalIsLoggingOut;
  const handleLogout = externalOnLogout || (() => logoutMutate());

  // Determine current active app from URL (/dashboard/apps/[appName]) if not provided explicitly
  const appMatch = pathname.match(/^\/dashboard\/apps\/([^/]+)/);
  const urlApp = appMatch ? decodeURIComponent(appMatch[1]) : null;
  const activeSelectedApp =
    externalSelectedApp !== undefined ? externalSelectedApp : urlApp;

  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true";

  const tabs = ([
    { id: "overview", label: "Projects", href: "/dashboard" },
    { id: "keys", label: "API Keys", href: "/dashboard/keys" },
    !isSelfHosted && { id: "subscription", label: "Subscription", href: "/dashboard/subscription" },
    !isSelfHosted && { id: "billing", label: "Billing", href: "/dashboard/billing" },
    { id: "settings", label: "Settings", href: "/dashboard/settings" },
    { id: "docs", label: "Docs", href: "/docs" },
  ].filter(Boolean) as { id: string; label: string; href: string }[]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/apps");
    }
    return pathname.startsWith(href);
  };

  const handleSelectApp = (appName: string | null) => {
    if (onSelectApp) {
      onSelectApp(appName);
    } else {
      if (appName) {
        router.push(`/dashboard/apps/${encodeURIComponent(appName)}`);
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleNewProject = () => {
    if (onNewProject) {
      onNewProject();
    } else {
      setInternalCreateOpen(true);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      refetchApps();
    }
  };

  return (
    <>
      <CreateAppModal
        isOpen={internalCreateOpen}
        onClose={() => setInternalCreateOpen(false)}
        onCreated={(name) => {
          router.push(`/dashboard/apps/${encodeURIComponent(name)}`);
        }}
      />

      <header className="sticky top-0 z-40 h-14 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <Link
              href="/dashboard"
              onClick={() => handleSelectApp(null)}
              className="flex items-center gap-2.5"
            >
              <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                <CloudLightning className="h-3.5 w-3.5 text-black fill-black" />
              </div>
              <span className="text-sm font-bold tracking-tight hidden sm:inline">ZenOTA</span>
            </Link>

            <span className="text-white/20 text-xs">/</span>

            <ProjectSelector
              apps={apps}
              selectedApp={activeSelectedApp}
              onSelectApp={handleSelectApp}
              onNewProject={handleNewProject}
            />

            <div className="hidden h-4 w-px bg-white/10 md:block" />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-white/40">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`${isActive(tab.href) ? "text-white" : "hover:text-white transition-colors"}`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors py-1.5 px-2.5 rounded-md hover:bg-white/[0.06] border border-white/5 hover:border-white/10"
              title="Documentation"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Docs</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              System Live
            </div>

            <div className="hidden h-4 w-px bg-white/10 sm:block" />

            <button
              onClick={handleRefresh}
              className="text-white/40 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading || isFetchingApps ? "animate-spin" : ""}`}
              />
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden sm:flex items-center gap-2 rounded border border-white/10 px-3 py-1.5 text-[12px] font-bold hover:bg-white/[0.05] transition-all"
            >
              {isLoggingOut ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              Logout
            </button>

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
                    isActive(tab.href) ? "bg-white/5 text-white" : "text-white/40"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-red-500 text-sm font-bold py-2 px-4"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
