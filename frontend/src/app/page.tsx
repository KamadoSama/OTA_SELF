"use client";

import { useState } from "react";
import {
  Smartphone,
  DownloadCloud,
  Upload,
  Search,
  History,
  ChevronRight,
  LogOut,
  Zap,
  Shield,
  GitBranch,
  HardDrive,
  X,
  Loader2,
  Activity,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useUpdates, useDeleteUpdate, useUploadUpdate } from "@/hooks/useUpdates";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import type { Update } from "@/services/updates.service";

// — Skeleton components —
function KpiSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 p-5 animate-pulse">
      <div className="h-3 w-24 bg-slate-800 rounded mb-4" />
      <div className="h-7 w-20 bg-slate-700 rounded mb-2" />
      <div className="h-2 w-32 bg-slate-800 rounded" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-800/40">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 rounded bg-slate-800 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

const colorMap: Record<string, string> = {
  emerald: "text-emerald-400",
  indigo: "text-indigo-400",
  violet: "text-violet-400",
  sky: "text-sky-400",
};

export default function Dashboard() {
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [appName, setAppName] = useState("MyExpoApp");
  const [channelName, setChannelName] = useState("production");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: user } = useCurrentUser();
  const { data: updates = [], isLoading, isError, refetch } = useUpdates();
  const { mutate: deleteUpdate } = useDeleteUpdate();
  const { mutate: uploadUpdate, isPending: isUploading } = useUploadUpdate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const filtered = updates.filter(
    (u: Update) =>
      u.runtimeVersion.toLowerCase().includes(search.toLowerCase()) ||
      u.channel.name.toLowerCase().includes(search.toLowerCase()) ||
      u.platform.toLowerCase().includes(search.toLowerCase()) ||
      u.channel.app.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = updates.filter((u: Update) => {
    // Most recent update per channel+platform is "Active"
    const sorted = [...updates].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latest = sorted.find(
      (x) => x.channel.id === u.channel.id && x.platform === u.platform,
    );
    return latest?.id === u.id;
  }).length;

  const kpis = [
    {
      label: "Updates Déployées",
      value: isLoading ? "—" : `${updates.length}`,
      sub: `${activeCount} actives`,
      icon: DownloadCloud,
      color: "emerald",
      glow: "rgba(16,185,129,0.15)",
    },
    {
      label: "Branches",
      value: isLoading ? "—" : `${new Set(updates.map((u: Update) => u.channel.name)).size}`,
      sub: [...new Set(updates.map((u: Update) => u.channel.name))].join(" · ") || "—",
      icon: GitBranch,
      color: "indigo",
      glow: "rgba(99,102,241,0.15)",
    },
    {
      label: "Applications",
      value: isLoading ? "—" : `${new Set(updates.map((u: Update) => u.channel.app.name)).size}`,
      sub: [...new Set(updates.map((u: Update) => u.channel.app.name))].join(", ") || "—",
      icon: Smartphone,
      color: "violet",
      glow: "rgba(139,92,246,0.15)",
    },
    {
      label: "iOS vs Android",
      value: isLoading ? "—" : `${updates.filter((u: Update) => u.platform === "ios").length}/${updates.filter((u: Update) => u.platform === "android").length}`,
      sub: "ios / android",
      icon: HardDrive,
      color: "sky",
      glow: "rgba(14,165,233,0.15)",
    },
  ];

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
      {/* Upload Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-700/60 p-6 shadow-2xl"
            style={{ background: "rgba(15,23,42,0.97)", boxShadow: "0 0 0 1px rgba(16,185,129,0.08), 0 32px 80px rgba(0,0,0,0.6)" }}
          >
            <button onClick={() => setShowDialog(false)} className="absolute right-4 top-4 text-slate-500 hover:text-slate-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <h2 className="font-mono font-bold text-lg text-emerald-400">Déployer une Mise à Jour</h2>
              <p className="text-sm text-slate-400 mt-1 font-mono">
                Archive <code className="bg-slate-800 px-1 rounded text-emerald-300 text-xs border border-slate-700">.zip</code> générée par <code className="bg-slate-800 px-1 rounded text-emerald-300 text-xs border border-slate-700">npx expo export</code>.
              </p>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              {[
                { id: "appName", label: "Projet", value: appName, setter: setAppName },
                { id: "channelName", label: "Channel", value: channelName, setter: setChannelName },
              ].map((f) => (
                <div key={f.id} className="space-y-1.5">
                  <label htmlFor={f.id} className="text-xs font-mono font-medium uppercase tracking-widest text-slate-400">{f.label}</label>
                  <input id={f.id} value={f.value} onChange={(e) => f.setter(e.target.value)}
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm font-mono text-slate-100 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
              ))}
              <div className="space-y-1.5">
                <label htmlFor="file" className="text-xs font-mono font-medium uppercase tracking-widest text-slate-400">Archive (.zip)</label>
                <input id="file" type="file" accept=".zip" required onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm font-mono text-slate-300 cursor-pointer outline-none file:bg-slate-800 file:border-0 file:text-xs file:font-mono file:text-emerald-300 file:px-3 file:py-1 file:rounded-lg file:mr-3 hover:file:bg-slate-700 transition-all" />
              </div>
              <button type="submit" disabled={isUploading || !selectedFile}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-mono font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #059669, #10b981)", boxShadow: "0 0 20px rgba(16,185,129,0.25)" }}>
                {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : <><Upload className="h-4 w-4" />Déployer</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 flex h-[60px] items-center gap-4 border-b border-slate-800/60 px-6"
        style={{ background: "rgba(2,8,23,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(99,102,241,0.2))", border: "1px solid rgba(16,185,129,0.2)" }}>
            <DownloadCloud className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-slate-100">OTA<span className="text-emerald-400">_CTRL</span></span>
        </div>

        <div className="ml-6 hidden md:flex relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input type="search" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-9 pr-4 py-2 text-xs font-mono text-slate-300 placeholder:text-slate-600 outline-none focus:border-slate-700 transition-all" />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user && <span className="hidden sm:block text-xs font-mono text-slate-500">{user.email}</span>}
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ background: "#10b981" }} />
            <span className="text-xs font-mono text-slate-400 hidden sm:block">Opérationnel</span>
          </div>
          <div className="h-5 w-px bg-slate-800" />
          <button onClick={() => refetch()} className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-2.5 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all" title="Actualiser">
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => logout()} disabled={isLoggingOut}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all">
            {isLoggingOut ? <Loader2 className="h-3 w-3 animate-spin" /> : <LogOut className="h-3 w-3" />}
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-slate-100 tracking-tight">Platform Overview</h1>
            <p className="text-xs font-mono text-slate-500 mt-0.5">OTA_CTRL · Expo Updates Dashboard</p>
          </div>
          <button onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-mono font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #059669, #10b981)", boxShadow: "0 0 20px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.3)" }}>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:block">Nouvelle Release</span>
          </button>
        </div>

        {/* Error banner */}
        {isError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-400">
            Impossible de charger les mises à jour. Vérifiez que le backend est en ligne.
            <button onClick={() => refetch()} className="ml-auto text-xs underline">Réessayer</button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
            : kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label}
                    className="relative overflow-hidden rounded-2xl border border-slate-800/60 p-5 transition-all duration-300 hover:border-slate-700 hover:scale-[1.02] cursor-default"
                    style={{ background: "rgba(15,23,42,0.9)", boxShadow: `0 0 40px ${kpi.glow}, 0 1px 0 rgba(255,255,255,0.04) inset` }}>
                    <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-40" style={{ background: `radial-gradient(circle, ${kpi.glow}, transparent)`, filter: "blur(16px)" }} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                        <Icon className={`h-4 w-4 ${colorMap[kpi.color]}`} />
                      </div>
                      <div className={`text-2xl font-bold font-mono tracking-tight ${colorMap[kpi.color]}`}>{kpi.value}</div>
                      <p className="mt-1 text-xs font-mono text-slate-600 truncate">{kpi.sub}</p>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Status row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Zap, label: "API Backend", value: "En ligne · :3001", color: "emerald" },
            { icon: Shield, label: "MinIO Storage", value: "Opérationnel · us-east-1", color: "sky" },
            { icon: Activity, label: "Uptime", value: "99.98% · 30 derniers jours", color: "violet" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-3 hover:border-slate-700/60 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: item.color === "emerald" ? "rgba(16,185,129,0.1)" : item.color === "sky" ? "rgba(14,165,233,0.1)" : "rgba(139,92,246,0.1)" }}>
                  <Icon className={`h-4 w-4 ${item.color === "emerald" ? "text-emerald-400" : item.color === "sky" ? "text-sky-400" : "text-violet-400"}`} />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs font-mono font-medium text-slate-300">{item.value}</p>
                </div>
                <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-800/60 overflow-hidden" style={{ background: "rgba(15,23,42,0.6)" }}>
          <div className="flex items-center justify-between border-b border-slate-800/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <History className="h-4 w-4 text-slate-500" />
              <div>
                <h2 className="text-sm font-semibold font-mono text-slate-100">Historique des Mises à Jour</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Flux en direct · toutes branches et versions</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono text-slate-400">
              {isLoading ? "..." : `${filtered.length} entrées`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 bg-slate-950/50">
                  {["ID", "App · Channel", "Runtime Version", "Platform", "Date", "Statut", ""].map((h, i) => (
                    <th key={i} className={`px-6 py-3 text-left text-xs font-mono font-medium uppercase tracking-widest text-slate-500 ${i === 5 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} />)
                  : filtered.map((update: Update) => (
                    <tr key={update.id} className="group transition-colors hover:bg-slate-800/30 cursor-pointer">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">#{update.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs text-slate-300">{update.channel.app.name}</span>
                          <span className={`inline-flex w-fit items-center rounded-lg px-2 py-0.5 text-xs font-mono font-medium border ${
                            update.channel.name === "production"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border-slate-700 bg-slate-800/60 text-slate-400"
                          }`}>{update.channel.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-200">{update.runtimeVersion}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{update.platform === "ios" ? "🍎 iOS" : "🤖 Android"}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{new Date(update.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {isActive(update) ? (
                            <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Actif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 px-2.5 py-1 text-xs font-mono text-slate-500">Archivé</span>
                          )}
                          <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(update.id); }}
                          disabled={deletingId === update.id}
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-7 w-7 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"
                          title="Supprimer"
                        >
                          {deletingId === update.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {!isLoading && filtered.length === 0 && (
              <div className="py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-700 mb-3" />
                <p className="text-sm font-mono text-slate-600">
                  {updates.length === 0 ? "Aucune mise à jour déployée pour l'instant." : `Aucun résultat pour "${search}"`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
