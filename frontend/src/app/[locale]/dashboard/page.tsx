"use client";

import { useState } from "react";
import {
  Upload,
  Search,
  X,
  Loader2,
  Trash2,
  Key,
} from "lucide-react";
import Link from "next/link";

// Components
import { Navbar } from "./components/Navbar";
import { StatsGrid } from "./components/StatsGrid";
import { DeploymentTable, type SortField, type SortOrder } from "./components/DeploymentTable";
import { ApiKeyTable } from "./components/ApiKeyTable";
import { UploadDialog } from "./components/UploadDialog";
import { ApiKeyModal } from "./components/ApiKeyModal";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";

// Hooks & Services
import { useUpdates, useDeleteUpdate, useSubscription } from "@/hooks/useUpdates";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey } from "@/hooks/useApiKeys";
import type { Update } from "@/services/updates.service";
import { ShieldCheck } from "lucide-react";


export default function Dashboard() {
  const { data: stats } = useSubscription();
  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === 'true';
  const isExpired = !isSelfHosted && stats?.trialEndsAt && new Date(stats.trialEndsAt) < new Date() && !stats.cardLast4;

  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'key' | 'update' } | null>(null);

  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: user } = useCurrentUser();
  const { data: updatesData, isLoading, refetch } = useUpdates(page, limit);
  const updates = updatesData?.data || [];
  const meta = updatesData?.meta;
  const { data: apiKeys = [], isLoading: isLoadingKeys } = useApiKeys();
  const { mutate: deleteUpdate } = useDeleteUpdate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: generateKey, isPending: isGeneratingKey } = useGenerateApiKey();
  const { mutate: deleteKey } = useDeleteApiKey();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filtered = updates.filter(
    (u: Update) =>
      u.runtimeVersion.toLowerCase().includes(search.toLowerCase()) ||
      u.channel.name.toLowerCase().includes(search.toLowerCase()) ||
      u.platform.toLowerCase().includes(search.toLowerCase()) ||
      u.channel.app.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isActive = (u: Update) => {
    const sorted = [...updates].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latest = sorted.find(
      (x) =>
        x.channel.app.name === u.channel.app.name &&
        x.channel.name === u.channel.name &&
        x.platform === u.platform,
    );
    return latest?.id === u.id;
  };

  const sortedUpdates = [...filtered].sort((a: Update, b: Update) => {
    let valA: any;
    let valB: any;

    switch (sortField) {
      case "app":
        valA = a.channel.app.name.toLowerCase();
        valB = b.channel.app.name.toLowerCase();
        break;
      case "channel":
        valA = a.channel.name.toLowerCase();
        valB = b.channel.name.toLowerCase();
        break;
      case "runtimeVersion":
        valA = a.runtimeVersion.toLowerCase();
        valB = b.runtimeVersion.toLowerCase();
        break;
      case "platform":
        valA = a.platform.toLowerCase();
        valB = b.platform.toLowerCase();
        break;
      case "downloadCount":
        valA = a.downloadCount || 0;
        valB = b.downloadCount || 0;
        break;
      case "status":
        valA = isActive(a) ? 1 : 0;
        valB = isActive(b) ? 1 : 0;
        break;
      case "createdAt":
      default:
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
        break;
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });


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
      }
    });
  };

  const handleConfirmCopy = () => {
    setNewRawKey(null);
    setShowKeyDialog(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'key') {
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
          backgroundSize: '32px 32px'
        }}
      />

      {/* Upload Dialog */}
      <UploadDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />

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
        isLoading={isLoading}
        isLoggingOut={isLoggingOut}
        onRefresh={refetch}
        onLogout={logout}
      />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 space-y-10 max-w-7xl">
        {isExpired && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-red-500" />
              <p className="text-sm font-medium text-white/80">
                Your Professional trial has expired. <span className="hidden sm:inline text-white/40">Please update your payment method to continue using Pro features.</span>
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-10 gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter">Project Overview</h1>
              <p className="text-sm text-white/40 font-medium">Manage your Expo Over-The-Air deployment flow.</p>
            </div>
            <button onClick={() => setShowDialog(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all">
              <Upload className="h-4 w-4" />
              New Deployment
            </button>
          </div>

          <StatsGrid totalUpdates={meta?.total || 0} updates={updates} stats={stats} />

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Active History</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                <input 
                  type="text" 
                  placeholder="Search version..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded pl-9 pr-4 py-1.5 text-xs font-medium outline-none focus:border-white/20 transition-all" 
                />
              </div>
            </div>
            
            <DeploymentTable 
              isLoading={isLoading}
              updates={sortedUpdates}
              deletingId={deletingId}
              onDeleteItem={(id) => setItemToDelete({ id, type: 'update' })}
              isActive={isActive}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              pagination={meta}
              onPageChange={setPage}
            />
          </div>

          <ApiKeyTable 
            isLoading={isLoadingKeys}
            apiKeys={apiKeys}
            onGenerateKey={handleGenerateKey}
            onDeleteItem={(id) => setItemToDelete({ id, type: 'key' })}
            isGeneratingKey={isGeneratingKey}
            error={keyError}
            activeKeysCount={stats?.activeApiKeys || 0}
            keysLimit={stats?.apiKeysLimit || 0}
          />
        </div>
      </main>
    </div>
  );
}
