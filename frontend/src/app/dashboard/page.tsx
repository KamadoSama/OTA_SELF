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

// Components
import { Navbar } from "./components/Navbar";
import { StatsGrid } from "./components/StatsGrid";
import { DeploymentTable } from "./components/DeploymentTable";
import { ApiKeyTable } from "./components/ApiKeyTable";

// Hooks & Services
import { useUpdates, useDeleteUpdate, useUploadUpdate } from "@/hooks/useUpdates";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey } from "@/hooks/useApiKeys";
import type { Update } from "@/services/updates.service";

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" className={className} fill="currentColor">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8-42.3 0-82.7 24.3-104.2 61.4-44.5 76.8-11.4 191.4 31.5 253.3 21 30.2 46.6 64.2 79.4 63 32-1.2 44.1-20.6 82.6-20.6 38.2 0 49.3 20.6 82.6 20.6 33.4 0 57.4-30.2 78.3-60.6 24-34.9 33.9-68.7 34.1-70.5-.8-.4-65.4-25.1-65.5-100.2zM233 105c15.8-19.1 26.5-45.7 23.6-72.3-22.9 1-50.7 15.3-67.1 34.5-14.7 17.1-27.5 44.5-24 70.2 25.5 2 51.8-13.3 67.5-32.4z" />
    </svg>
  );
}

function AndroidLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 576 512" className={className} fill="currentColor">
      <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m271.3-64.2,35.2-61a12,12,0,0,0-4.39-16.39,12,12,0,0,0-16.39,4.39l-35.6,61.7c-37.4-16.2-79.1-25.1-122.9-25.1s-85.5,8.9-122.9,25.1L129,164.73a12,12,0,0,0-16.39-4.39,12,12,0,0,0-4.39,16.39l35.2,61C73.15,274.53,24,338.43,24,413.53H552c0-75.1-49.15-139-119.25-175.8" />
    </svg>
  );
}

export default function Dashboard() {
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [appName, setAppName] = useState("my-app");
  const [channelName, setChannelName] = useState("production");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'key' | 'update' } | null>(null);

  const { data: user } = useCurrentUser();
  const { data: updates = [], isLoading, refetch } = useUpdates();
  const { data: apiKeys = [], isLoading: isLoadingKeys } = useApiKeys();
  const { mutate: deleteUpdate } = useDeleteUpdate();
  const { mutate: uploadUpdate, isPending: isUploading } = useUploadUpdate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: generateKey, isPending: isGeneratingKey } = useGenerateApiKey();
  const { mutate: deleteKey } = useDeleteApiKey();

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
      (x) => x.channel.id === u.channel.id && x.platform === u.platform,
    );
    return latest?.id === u.id;
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadUpdate(
      { file: selectedFile, appName, channelName },
      {
        onSuccess: () => {
          setShowDialog(false);
          setSelectedFile(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteUpdate(id, { onSettled: () => setDeletingId(null) });
  };

  const handleGenerateKey = () => {
    generateKey(undefined, {
      onSuccess: (res) => {
        setNewRawKey(res.rawKey);
        setShowKeyDialog(true);
      }
    });
  };

  const handleConfirmCopy = () => {
    if (newRawKey) {
      navigator.clipboard.writeText(newRawKey);
      setNewRawKey(null);
      setShowKeyDialog(false);
    }
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
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-2xl">
            <button onClick={() => setShowDialog(false)} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-8">
              <h2 className="text-xl font-bold tracking-tight">Deploy Update</h2>
              <p className="text-[13px] text-white/40 mt-1 font-medium">
                Upload the <code className="bg-white/5 px-1.5 py-0.5 rounded text-white italic">.zip</code> archive from your <code className="bg-white/5 px-1.5 py-0.5 rounded text-white italic">dist</code> folder.
              </p>
            </div>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="appName" className="text-[11px] font-bold uppercase tracking-widest text-white/40">App Slug</label>
                  <input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium outline-none focus:border-white/30 transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="channelName" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Channel</label>
                  <input id="channelName" value={channelName} onChange={(e) => setChannelName(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium outline-none focus:border-white/30 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="file" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Bundle (.zip)</label>
                <div className="relative group overflow-hidden rounded border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/40 transition-all">
                  <input id="file" type="file" accept=".zip" required onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="px-6 py-10 flex flex-col items-center gap-3">
                    <Upload className="h-6 w-6 text-white/20 group-hover:text-white transition-colors" />
                    <span className="text-[13px] text-white/40 group-hover:text-white transition-colors text-center px-4">
                      {selectedFile ? selectedFile.name : "Click to select or drag and drop"}
                    </span>
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isUploading || !selectedFile}
                className="w-full flex items-center justify-center gap-2 rounded bg-white py-3 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-40">
                {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</> : "Start Deployment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showKeyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-2xl">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-center sm:text-left">API Key Generated</h2>
            <p className="text-sm text-white/40 mb-6 text-center sm:text-left">
              Copy this key now. For security reasons, <span className="text-white font-bold">it will not be shown again.</span>
            </p>
            <div className="flex items-center gap-2 p-4 rounded bg-white/5 border border-white/10 mb-8 font-mono text-xs break-all">
              <Key className="h-4 w-4 text-white/20 shrink-0" />
              {newRawKey}
            </div>
            <button onClick={handleConfirmCopy}
              className="w-full rounded bg-white py-3 text-sm font-bold text-black hover:bg-white/90 transition-all">
              Copy and Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded border border-white/10 bg-[#080808] p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-lg font-bold tracking-tight mb-2">Delete {itemToDelete.type === 'key' ? 'API Key' : 'Update'}?</h2>
              <p className="text-[13px] text-white/40 mb-8 leading-relaxed">
                This action is irreversible. The {itemToDelete.type === 'key' ? 'token will be invalidated' : 'deployment bundle will be removed'}.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => {
                if (itemToDelete.type === 'key') {
                  deleteKey(itemToDelete.id);
                } else {
                  handleDelete(itemToDelete.id);
                }
                setItemToDelete(null);
              }}
                className="w-full rounded bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all">
                Confirm Delete
              </button>
              <button onClick={() => setItemToDelete(null)}
                className="w-full rounded border border-white/5 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar 
        isLoading={isLoading}
        isLoggingOut={isLoggingOut}
        onRefresh={refetch}
        onLogout={logout}
      />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 space-y-10 max-w-7xl">
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

          <StatsGrid updates={updates} />

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
              updates={filtered}
              deletingId={deletingId}
              onDeleteItem={(id) => setItemToDelete({ id, type: 'update' })}
              isActive={isActive}
              AppleLogo={AppleLogo}
              AndroidLogo={AndroidLogo}
            />
          </div>

          <ApiKeyTable 
            isLoading={isLoadingKeys}
            apiKeys={apiKeys}
            onGenerateKey={handleGenerateKey}
            onDeleteItem={(id) => setItemToDelete({ id, type: 'key' })}
            isGeneratingKey={isGeneratingKey}
          />
        </div>
      </main>
    </div>
  );
}
