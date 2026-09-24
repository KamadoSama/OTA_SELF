"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  MoreVertical,
  Upload,
  Smartphone,
  GitBranch,
  Users,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { AppSummary } from "@/services/apps.service";
import { Icon } from "@iconify/react";

interface ProjectsGridProps {
  apps: AppSummary[];
  isLoading: boolean;
  onSelectApp: (appName: string) => void;
  onNewProject: () => void;
  onUploadForApp?: (appName: string) => void;
}

const PALETTES = [
  { gradient: "from-[#ea580c] to-[#c2410c]", letter: "text-white" }, // Orange (like Paytou)
  { gradient: "from-[#0891b2] to-[#0e7490]", letter: "text-white" }, // Cyan (like bingoo-pro)
  { gradient: "from-[#65a30d] to-[#4d7c0f]", letter: "text-white" }, // Lime/Green (like bingoo_client)
  { gradient: "from-[#9333ea] to-[#7e22ce]", letter: "text-white" }, // Purple (like bingoo-gerant)
  { gradient: "from-[#0284c7] to-[#0369a1]", letter: "text-white" }, // Blue (like e-Gare-Agent)
  { gradient: "from-[#4f46e5] to-[#4338ca]", letter: "text-white" }, // Indigo (like e-go-taxi)
  { gradient: "from-[#e11d48] to-[#be123c]", letter: "text-white" }, // Rose
  { gradient: "from-[#059669] to-[#047857]", letter: "text-white" }, // Emerald
];

export function getAppPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

function timeAgo(dateString?: string): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function ProjectsGrid({
  apps,
  isLoading,
  onSelectApp,
  onNewProject,
  onUploadForApp,
}: ProjectsGridProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"activity" | "name" | "updates">("activity");

  const filteredApps = useMemo(() => {
    return apps
      .filter((app) => app.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "updates") return b.updatesCount - a.updatesCount;
        // Default: activity (latest update date)
        const dateA = a.latestUpdate?.createdAt ? new Date(a.latestUpdate.createdAt).getTime() : 0;
        const dateB = b.latestUpdate?.createdAt ? new Date(b.latestUpdate.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [apps, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Header: Tabs & New Project Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/5 p-1 rounded-lg">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 text-xs font-bold text-white shadow-sm">
              <span>Projects</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-white/70 font-mono">
                {apps.length}
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-white/90 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/30 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-white/60">
            <span className="text-[11px] text-white/30 uppercase font-bold tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer font-medium"
            >
              <option value="activity" className="bg-black text-white">Recent Activity</option>
              <option value="name" className="bg-black text-white">Project Name</option>
              <option value="updates" className="bg-black text-white">Total Deployments</option>
            </select>
          </div>

          {/* Grid / List Toggle */}
          <div className="flex items-center bg-[#0a0a0a] border border-white/10 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-white/5 bg-[#0a0a0a] p-6 animate-pulse space-y-4"
            >
              <div className="w-14 h-14 rounded-xl bg-white/5" />
              <div className="h-4 w-1/2 bg-white/5 rounded" />
              <div className="h-3 w-1/3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#070707] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              {search
                ? `No application matches "${search}".`
                : "Create your first project or deploy via ZenOTA CLI to get started."}
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-white/90 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create new project
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Expo.dev Style Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const palette = getAppPalette(app.name);
            const initial = app.name.charAt(0).toUpperCase();
            const latest = app.latestUpdate;

            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.name)}
                className="group relative rounded-xl border border-white/[0.08] bg-[#080808] hover:bg-[#0c0c0c] hover:border-white/20 transition-all duration-200 cursor-pointer p-6 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Card Top: 3-dots menu */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* App Icon with Blueprint Grid Texture */}
                    <div
                      className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${palette.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 overflow-hidden`}
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
                        `,
                        backgroundSize: "9px 9px",
                      }}
                    >
                      <span className="text-2xl font-black tracking-tight text-white drop-shadow-md select-none">
                        {initial}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-cyan-400" />
                      </h3>
                      <p className="text-xs text-white/40 font-mono">{app.name}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectApp(app.name);
                    }}
                    className="p-1 rounded text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Card Center: Channels & Platform badges */}
                <div className="my-5 flex items-center gap-2 flex-wrap">
                  {app.channels.slice(0, 3).map((ch) => (
                    <span
                      key={ch}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 lowercase"
                    >
                      {ch}
                    </span>
                  ))}
                  {app.channels.length > 3 && (
                    <span className="text-[10px] text-white/30 font-semibold">
                      +{app.channels.length - 3}
                    </span>
                  )}

                  {latest && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                      {latest.platform === "ios" ? (
                        <Icon icon="fa6-brands:apple" className="h-3 w-3 text-white" />
                      ) : (
                        <Icon icon="fa6-brands:android" className="h-3 w-3 text-emerald-400" />
                      )}
                      <span>v{latest.runtimeVersion}</span>
                    </span>
                  )}
                </div>

                {/* Card Bottom: Activity footer (Expo Style) */}
                <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-white/40">
                  <div className="flex items-center gap-1.5 truncate">
                    <Upload className="h-3 w-3 text-white/30 shrink-0" />
                    <span className="truncate">
                      {latest
                        ? `Update ${latest.rolloutPercentage < 100 ? `(${latest.rolloutPercentage}%)` : ""} ${timeAgo(latest.createdAt)}`
                        : "No updates published"}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-white/30 shrink-0 font-medium">
                    {app.updatesCount} {app.updatesCount === 1 ? "deploy" : "deploys"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-white/[0.08] bg-[#080808] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/30 font-semibold uppercase tracking-wider text-[10px]">
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Channels</th>
                <th className="px-6 py-3">Latest Release</th>
                <th className="px-6 py-3">Deployments</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredApps.map((app) => {
                const palette = getAppPalette(app.name);
                const initial = app.name.charAt(0).toUpperCase();
                const latest = app.latestUpdate;

                return (
                  <tr
                    key={app.id}
                    onClick={() => onSelectApp(app.name)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${palette.gradient} flex items-center justify-center font-bold text-white shadow-sm shrink-0`}
                      >
                        {initial}
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {app.name}
                        </div>
                        <div className="text-[10px] text-white/30 font-mono">{app.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {app.channels.map((ch) => (
                          <span
                            key={ch}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/60 font-semibold"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {latest ? (
                        <div className="space-y-0.5">
                          <div className="font-mono text-white/80 font-bold">
                            v{latest.runtimeVersion} {latest.rolloutPercentage < 100 && `(${latest.rolloutPercentage}%)`}
                          </div>
                          <div className="text-[10px] text-white/30">{timeAgo(latest.createdAt)}</div>
                        </div>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white/70">
                      {app.updatesCount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
