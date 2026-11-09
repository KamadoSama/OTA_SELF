"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";

// Components
import { Navbar } from "./components/Navbar";
import { ProjectsGrid } from "./components/ProjectsGrid";
import { CreateAppModal } from "./components/CreateAppModal";
import { UploadDialog } from "./components/UploadDialog";

// Hooks
import { useApps } from "@/hooks/useApps";
import { useSubscription } from "@/hooks/useUpdates";
import { useIsSelfHosted } from "@/hooks/useSelfHosted";

export default function Dashboard() {
  const router = useRouter();
  const { data: stats } = useSubscription();
  const isSelfHosted = useIsSelfHosted();
  const isExpired =
    !isSelfHosted && stats?.trialEndsAt && new Date(stats.trialEndsAt) < new Date() && !stats.cardLast4;

  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [uploadApp, setUploadApp] = useState<string | null>(null);

  const { data: apps = [], isLoading: isLoadingApps, refetch: refetchApps } = useApps();

  const handleSelectApp = (appName: string) => {
    router.push(`/dashboard/apps/${encodeURIComponent(appName)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Texture background: Dot Grid */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Upload Dialog for quick upload */}
      <UploadDialog
        isOpen={Boolean(uploadApp)}
        onClose={() => setUploadApp(null)}
        defaultAppName={uploadApp || "my-app"}
      />

      {/* Create App Modal */}
      <CreateAppModal
        isOpen={showCreateAppModal}
        onClose={() => setShowCreateAppModal(false)}
        onCreated={(name) => {
          router.push(`/dashboard/apps/${encodeURIComponent(name)}`);
        }}
      />

      <Navbar
        isLoading={isLoadingApps}
        onRefresh={() => refetchApps()}
        apps={apps}
        selectedApp={null}
        onNewProject={() => setShowCreateAppModal(true)}
      />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 space-y-10 max-w-7xl">
        {isExpired && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-white/80">
                Your Professional trial has expired.{" "}
                <span className="hidden sm:inline text-white/40">
                  Please update your payment method to continue using Pro features.
                </span>
              </p>
            </div>
            <Link
              href="/dashboard/subscription"
              className="px-4 py-1.5 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition-colors shrink-0"
            >
              Fix Now
            </Link>
          </div>
        )}

        {/* All Projects View */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ProjectsGrid
            apps={apps}
            isLoading={isLoadingApps}
            onSelectApp={handleSelectApp}
            onNewProject={() => setShowCreateAppModal(true)}
            onUploadForApp={(name) => setUploadApp(name)}
          />
        </div>
      </main>
    </div>
  );
}
