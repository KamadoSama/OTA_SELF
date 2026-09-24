"use client";

import { useState } from "react";
import {
  Upload,
  Search,
  X,
  Loader2,
  Trash2,
  Key,
  ShieldCheck,
  ArrowLeft,
  Terminal,
} from "lucide-react";
import { Link } from "@/i18n/routing";

// Components
import { Navbar } from "./components/Navbar";
import { StatsGrid } from "./components/StatsGrid";
import { AdoptionChart } from "./components/AdoptionChart";
import { DeploymentTable, type SortField, type SortOrder } from "./components/DeploymentTable";
import { ApiKeyTable } from "./components/ApiKeyTable";
import { UploadDialog } from "./components/UploadDialog";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { ProjectsGrid, getAppPalette } from "./components/ProjectsGrid";
import { CreateAppModal } from "./components/CreateAppModal";

// Hooks & Services
import { useUpdates, useDeleteUpdate, useSubscription } from "@/hooks/useUpdates";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey } from "@/hooks/useApiKeys";
import { useApps } from "@/hooks/useApps";
import type { Update } from "@/services/updates.service";

export default function Dashboard() {
  const { data: stats } = useSubscription();
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true";
  const isExpired =
    !isSelfHosted && stats?.trialEndsAt && new Date(stats.trialEndsAt) < new Date() && !stats.cardLast4;

  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showCreateAppModal, setShowCreateAppModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "key" | "update" } | null>(null);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: user } = useCurrentUser();
  const { data: apps = [], isLoading: isLoadingApps, refetch: refetchApps } = useApps();
  const {
    data: updatesData,
    isLoading,
    refetch: refetchUpdates,
  } = useUpdates(page, limit, search, sortField, sortOrder, selectedApp || undefined);

  const updates = updatesData?.data || [];
  const meta = updatesData?.meta;
  const { data: apiKeys = [], isLoading: isLoadingKeys } = useApiKeys();
  const { mutate: deleteUpdate } = useDeleteUpdate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: generateKey, isPending: isGeneratingKey } = useGenerateApiKey();
  const { mutate: deleteKey } = useDeleteApiKey();

  const activeApp = apps.find((a) => a.name === selectedApp);
  const activePalette = selectedApp ? getAppPalette(selectedApp) : null;

  const handleRefreshAll = () => {
    refetchUpdates();
    refetchApps();
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSort = (field: SortField) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const isActive = (u: Update) => {
    if (u.isRollback) return false;
    const sorted = [...updates]
      .filter((x) => !x.isRollback)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latest = sorted.find(
      (x) =>
        x.channel.app.name === u.channel.app.name &&
        x.channel.name === u.channel.name &&
        x.platform === u.platform
    );
    return latest?.id === u.id;
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteUpdate(id, {
      onSuccess: () => {},
      onSettled: () => setDeletingId(null),
    });
  };

  const handleGenerateKey = () => {
    setKeyError(null);
    generateKey(undefined, {
      onSuccess: (res) => {
        setNewRawKey(res.rawKey);
        setShowKeyDialog(true);
      },
      onError: (err: any) => {
        const message = err.response?.data?.message || "Failed to generate API key";
        setKeyError(message);
        setTimeout(() => setKeyError(null), 5000);
      },
    });
  };

  const handleConfirmCopy = () => {
    setNewRawKey(null);
    setShowKeyDialog(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "key") {
      deleteKey(itemToDelete.id);
    } else {
      handleDelete(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Texture background: Dot Grid (Very subtle) */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        defaultAppName={selectedApp || "my-app"}
      />

      {/* Create App Modal */}
      <CreateAppModal
        isOpen={showCreateAppModal}
        onClose={() => setShowCreateAppModal(false)}
        onCreated={(name) => {
          setSelectedApp(name);
          setPage(1);
        }}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showKeyDialog}
        apiKey={newRawKey}
        onClose={handleConfirmCopy}
      />

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        item={itemToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <Navbar
        isLoading={isLoading || isLoadingApps}
        isLoggingOut={isLoggingOut}
        onRefresh={handleRefreshAll}
        onLogout={logout}
        apps={apps}
        selectedApp={selectedApp}
        onSelectApp={(name) => {
          setSelectedApp(name);
          setPage(1);
        }}
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

        {selectedApp === null ? (
          /* ========================================================
             1. ALL PROJECTS VIEW (Expo.dev Style Cards Grid)
             ======================================================== */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProjectsGrid
              apps={apps}
              isLoading={isLoadingApps}
              onSelectApp={(name) => {
                setSelectedApp(name);
                setPage(1);
              }}
              onNewProject={() => setShowCreateAppModal(true)}
            />

            {/* Global API Key Table */}
            <div className="border-t border-white/[0.06] pt-10">
              <ApiKeyTable
                isLoading={isLoadingKeys}
                apiKeys={apiKeys}
                onGenerateKey={handleGenerateKey}
                onDeleteItem={(id) => setItemToDelete({ id, type: "key" })}
                isGeneratingKey={isGeneratingKey}
                error={keyError}
                activeKeysCount={stats?.activeApiKeys || 0}
                keysLimit={stats?.apiKeysLimit || 0}
              />
            </div>
          </div>
        ) : (
          /* ========================================================
             2. DEDICATED PROJECT VIEW (Focused App Workspace)
             ======================================================== */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Project Header */}
            <div className="border-b border-white/[0.06] pb-8 space-y-6">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setPage(1);
                }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to all projects</span>
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activePalette?.gradient || "from-cyan-500 to-blue-600"} flex items-center justify-center shadow-xl select-none shrink-0`}
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
                      `,
                      backgroundSize: "9px 9px",
                    }}
                  >
                    <span className="text-2xl font-black text-white">
                      {selectedApp.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        {selectedApp}
                      </h1>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {activeApp?.channels.map((ch) => (
                          <span
                            key={ch}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-white/70 lowercase"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 font-mono">
                      Expo Over-The-Air deployment flow &bull; Project slug: {selectedApp}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDialog(true)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-sm"
                  >
                    <Upload className="h-4 w-4" />
                    New Deployment
                  </button>
                </div>
              </div>
            </div>

            {/* App specific Stats */}
            <StatsGrid
              totalUpdates={meta?.total || 0}
              updates={updates}
              stats={stats}
            />

            {/* App specific Adoption Chart */}
            <AdoptionChart appName={selectedApp} />

            {/* App specific Deployments History */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">
                  {selectedApp} Deploy History
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                  <input
                    type="text"
                    placeholder="Search version or runtime..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded pl-9 pr-4 py-1.5 text-xs font-medium outline-none focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              <DeploymentTable
                isLoading={isLoading}
                updates={updates}
                deletingId={deletingId}
                onDeleteItem={(id) => setItemToDelete({ id, type: "update" })}
                isActive={isActive}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                pagination={meta}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
