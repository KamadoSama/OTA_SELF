"use client";

import { useState } from "react";
import {
  Smartphone,
  DownloadCloud,
  Upload,
  Search,
  GitBranch,
  X,
  Loader2,
  Activity,
  Trash2,
  RefreshCw,
  LogOut,
  ChevronRight,
  Terminal as TerminalIcon,
  Shield,
  Key,
  CloudLightning
} from "lucide-react";
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

  const { data: user } = useCurrentUser();
  const { data: updates = [], isLoading, isError, refetch } = useUpdates();
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
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black">
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
          <div className="relative w-full max-w-lg rounded border border-white/10 bg-[#080808] p-10 shadow-2xl">
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
              <div className="grid grid-cols-2 gap-4">
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
                    <span className="text-[13px] text-white/40 group-hover:text-white transition-colors">
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
          <div className="w-full max-w-md rounded border border-white/10 bg-[#080808] p-10 shadow-2xl">
            <h2 className="text-xl font-bold tracking-tight mb-4">API Key Generated</h2>
            <p className="text-sm text-white/40 mb-6">
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

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 h-14 flex items-center justify-between border-b border-white/[0.06] px-6 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <CloudLightning className="h-3.5 w-3.5 text-black fill-black" />
            </div>
            <span className="text-sm font-bold tracking-tight">ZenOTA</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-white/40">
            <a href="#" className="text-white">Overview</a>
            <a href="#" className="hover:text-white transition-colors">Applications</a>
            <a href="#" className="hover:text-white transition-colors">API Keys</a>
            <a href="#" className="hover:text-white transition-colors">Settings</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            System Live
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <button onClick={() => refetch()} className="text-white/40 hover:text-white transition-colors">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => logout()} disabled={isLoggingOut}
            className="flex items-center gap-2 rounded border border-white/10 px-3 py-1.5 text-[12px] font-bold hover:bg-white/[0.05] transition-all">
            {isLoggingOut ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12 relative z-10 space-y-10">
        
        {/* Top Header Section */}
        <div className="flex items-end justify-between border-b border-white/[0.06] pb-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Project Overview</h1>
            <p className="text-sm text-white/40 font-medium">Manage your Expo Over-The-Air deployment flow.</p>
          </div>
          <button onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 rounded bg-white px-5 py-2 text-sm font-bold text-black hover:bg-white/90 transition-all">
            <Upload className="h-4 w-4" />
            New Deployment
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded overflow-hidden">
          {[
            { label: "Total Updates", value: updates.length, icon: Smartphone },
            { label: "Channels", value: new Set(updates.map(u => u.channel.name)).size, icon: GitBranch },
            { label: "API Uptime", value: "99.9%", icon: Activity },
            { label: "Storage", value: "MinIO S3", icon: Shield }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-black p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</span>
                  <Icon className="h-3.5 w-3.5 text-white/20" />
                </div>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Deploy History Table */}
        <div className="rounded border border-white/[0.06] bg-[#050505] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-6">
               <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/80">Deploy History</h2>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                 <input type="text" placeholder="Search version..." value={search} onChange={(e) => setSearch(e.target.value)}
                   className="bg-white/[0.03] border border-white/5 rounded pl-9 pr-4 py-1.5 text-xs font-medium outline-none focus:border-white/20 transition-all w-64" />
               </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/30 font-medium">
                  {["App", "Channel", "Runtime", "Platform", "Date", "Status", "Actions"].map((th) => (
                    <th key={th} className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-white/30">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-5"><div className="h-3 w-full bg-white/5 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-white/20 font-medium">No updates found.</td>
                  </tr>
                ) : filtered.map((update: Update) => (
                  <tr key={update.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 font-bold tracking-tight">{update.channel.app.name}</td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-bold lowercase tracking-wide">
                        {update.channel.name}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-white/60">{update.runtimeVersion}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                        {update.platform === "ios" ? (
                          <>
                            <AppleLogo className="h-4 w-4 text-white" />
                            <span className="font-medium">iOS</span>
                          </>
                        ) : (
                          <>
                            <AndroidLogo className="h-4 w-4 text-emerald-400" />
                            <span className="font-medium">Android</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-white/30">{new Date(update.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      {isActive(update) ? (
                        <div className="flex items-center gap-2 text-white">
                          <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                          <span className="text-[11px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                      ) : (
                        <span className="text-white/20 text-[11px] font-bold uppercase tracking-widest">Archived</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                       <button onClick={() => handleDelete(update.id)} disabled={deletingId === update.id}
                         className="p-2 rounded border border-white/10 text-white/20 hover:text-white hover:border-white/30 transition-all disabled:opacity-30">
                         {deletingId === update.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Key Management */}
        <div className="rounded border border-white/[0.06] bg-[#050505] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="space-y-1">
               <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/80">CLI Access Tokens</h2>
               <p className="text-[11px] text-white/30">Use these keys to authenticate via the ZenOTA CLI.</p>
            </div>
            <button onClick={handleGenerateKey} disabled={isGeneratingKey}
              className="flex items-center gap-2 rounded border border-white/10 px-4 py-2 text-[12px] font-bold hover:bg-white/[0.05] transition-all">
              {isGeneratingKey ? <Loader2 className="h-3 w-3 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
              Generate New Key
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-white/30 font-medium">
                  {["Key Prefix", "Created", "Last Used", "Actions"].map((th) => (
                    <th key={th} className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-white/30">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {isLoadingKeys ? (
                   Array.from({ length: 2 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-6 py-5"><div className="h-3 w-full bg-white/5 rounded" /></td>
                      ))}
                    </tr>
                  ))
                ) : apiKeys.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-white/20 font-medium italic">No active keys. Generate one to start publishing from CLI.</td>
                  </tr>
                ) : apiKeys.map((key) => (
                  <tr key={key.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5 font-mono text-white/60">{key.prefix}••••••••••••</td>
                    <td className="px-6 py-5 text-white/30">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-white/30">{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never used"}</td>
                    <td className="px-6 py-5">
                       <button onClick={() => deleteKey(key.id)}
                         className="p-2 rounded border border-white/10 text-white/20 hover:text-white hover:border-white/30 transition-all">
                         <Trash2 className="h-3.5 w-3.5" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
