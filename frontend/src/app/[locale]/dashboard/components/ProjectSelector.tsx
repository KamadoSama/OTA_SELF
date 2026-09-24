"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, FolderKanban, Layers, Search } from "lucide-react";
import { AppSummary } from "@/services/apps.service";
import { getAppPalette } from "./ProjectsGrid";

interface ProjectSelectorProps {
  apps: AppSummary[];
  selectedApp: string | null;
  onSelectApp: (appName: string | null) => void;
  onNewProject: () => void;
}

export function ProjectSelector({
  apps,
  selectedApp,
  onSelectApp,
  onNewProject,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeApp = apps.find((a) => a.name === selectedApp);
  const activePalette = activeApp ? getAppPalette(activeApp.name) : null;

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button (Breadcrumb style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs font-semibold text-white select-none"
      >
        {activeApp ? (
          <>
            <div
              className={`w-4 h-4 rounded bg-gradient-to-br ${activePalette?.gradient} flex items-center justify-center text-[10px] font-black text-white shrink-0`}
            >
              {activeApp.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold tracking-tight text-white max-w-[120px] truncate">
              {activeApp.name}
            </span>
          </>
        ) : (
          <>
            <Layers className="h-3.5 w-3.5 text-white/50" />
            <span className="text-white/80">All Projects</span>
          </>
        )}
        <ChevronDown
          className={`h-3 w-3 text-white/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 p-1.5 space-y-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search bar inside dropdown */}
          <div className="relative px-2 py-1.5 border-b border-white/[0.06] mb-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-white/30" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent pl-6 pr-2 py-0.5 text-xs text-white placeholder-white/30 outline-none"
              autoFocus
            />
          </div>

          {/* All Projects item */}
          <button
            onClick={() => {
              onSelectApp(null);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              selectedApp === null
                ? "bg-white/10 text-white font-bold"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                <Layers className="h-3 w-3" />
              </div>
              <span>All Projects</span>
            </div>
            {selectedApp === null && <Check className="h-3.5 w-3.5 text-cyan-400" />}
          </button>

          {/* Apps List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 py-0.5 custom-scrollbar">
            {filteredApps.map((app) => {
              const palette = getAppPalette(app.name);
              const isSelected = selectedApp === app.name;

              return (
                <button
                  key={app.id}
                  onClick={() => {
                    onSelectApp(app.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-white/10 text-white font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      className={`w-5 h-5 rounded bg-gradient-to-br ${palette.gradient} flex items-center justify-center text-[10px] font-black text-white shrink-0`}
                    >
                      {app.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{app.name}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Footer: New Project Button */}
          <div className="border-t border-white/[0.06] pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                onNewProject();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create new project</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
