"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Upload,
  Search,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";

// Components
import { Navbar } from "../../components/Navbar";
import { StatsGrid } from "../../components/StatsGrid";
import { AdoptionChart } from "../../components/AdoptionChart";
import { DeploymentTable, type SortField, type SortOrder } from "../../components/DeploymentTable";
import { UploadDialog } from "../../components/UploadDialog";
import { DeleteConfirmationDialog } from "../../components/DeleteConfirmationDialog";
import { RollbackDialog } from "../../components/RollbackDialog";
import { getAppPalette } from "../../components/ProjectsGrid";

// Hooks & Services
import { useUpdates, useDeleteUpdate, useSubscription, useToggleRollback } from "@/hooks/useUpdates";
import { useApps } from "@/hooks/useApps";
import type { Update } from "@/services/updates.service";

export default function AppWorkspacePage() {
  const params = useParams();
  const rawAppName = params?.appName as string;
  const appName = rawAppName ? decodeURIComponent(rawAppName) : "";

  const { data: stats } = useSubscription();
  const { data: apps = [], isLoading: isLoadingApps } = useApps();
  const currentApp = apps.find((a) => a.name === appName);
  const palette = getAppPalette(appName || "app");

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "update" } | null>(null);
  const [itemToRollback, setItemToRollback] = useState<Update | null>(null);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: updatesData,
    isLoading: isLoadingUpdates,
    refetch: refetchUpdates,
  } = useUpdates(page, limit, search, sortField, sortOrder, appName || undefined);

  const updates = updatesData?.data || [];
  const meta = updatesData?.meta;

  const { mutate: deleteUpdate } = useDeleteUpdate();
  const { mutate: toggleRollback, isPending: isRollingBack } = useToggleRollback();

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

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    handleDelete(itemToDelete.id);
    setItemToDelete(null);
  };

  const handleConfirmRollback = () => {
    if (!itemToRollback) return;
    toggleRollback(itemToRollback.id, {
      onSuccess: () => {
        setItemToRollback(null);
      },
    });
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

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        defaultAppName={appName}
      />

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        item={itemToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Rollback Dialog */}
      <RollbackDialog
        update={itemToRollback}
        onConfirm={handleConfirmRollback}
        onCancel={() => setItemToRollback(null)}
        isPending={isRollingBack}
      />

      <Navbar
        isLoading={isLoadingUpdates || isLoadingApps}
        onRefresh={() => refetchUpdates()}
        selectedApp={appName}
      />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 max-w-7xl space-y-10">
        {/* Project Header */}
        <div className="border-b border-white/[0.06] pb-8 space-y-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all projects</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${palette.gradient} flex items-center justify-center shadow-xl select-none shrink-0`}
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
                  `,
                  backgroundSize: "9px 9px",
                }}
              >
                <span className="text-2xl font-black text-white">
                  {appName ? appName.charAt(0).toUpperCase() : "A"}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {appName}
                  </h1>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {currentApp?.channels?.map((ch) => (
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
                  Expo Over-The-Air deployment flow &bull; Project slug: {appName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {updates.some((u) => !u.isRollback) && (
                <button
                  onClick={() => {
                    const latest = updates.find((u) => !u.isRollback);
                    if (latest) setItemToRollback(latest);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm"
                  title="Rollback the currently active version"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Rollback Version</span>
                </button>
              )}

              <button
                onClick={() => setShowUploadDialog(true)}
                className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-sm"
              >
                <Upload className="h-4 w-4" />
                New Deployment
              </button>
            </div>
          </div>
        </div>

        {/* App-specific Stats */}
        <StatsGrid
          totalUpdates={meta?.total || 0}
          updates={updates}
          stats={stats}
        />

        {/* App-specific Adoption Chart */}
        <AdoptionChart appName={appName} />

        {/* App-specific Deployments History */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">
              {appName} Deploy History
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
            isLoading={isLoadingUpdates}
            updates={updates}
            deletingId={deletingId}
            onDeleteItem={(id) => setItemToDelete({ id, type: "update" })}
            rollingBackId={isRollingBack ? itemToRollback?.id : null}
            onRollbackItem={(update) => setItemToRollback(update)}
            isActive={isActive}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            pagination={meta}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
