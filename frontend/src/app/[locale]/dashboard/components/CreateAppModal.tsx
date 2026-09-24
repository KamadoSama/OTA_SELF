"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, FolderPlus } from "lucide-react";
import { useCreateApp } from "@/hooks/useApps";

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (appName: string) => void;
}

export function CreateAppModal({ isOpen, onClose, onCreated }: CreateAppModalProps) {
  const [name, setName] = useState("");
  const [scheme, setScheme] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mutate: createApp, isPending } = useCreateApp();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }

    // Format app slug (alphanumeric and dashes/underscores)
    const formattedName = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");

    setError(null);
    createApp(
      { name: formattedName, scheme: scheme.trim() || undefined },
      {
        onSuccess: (newApp) => {
          setName("");
          setScheme("");
          onClose();
          onCreated?.(newApp.name);
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || err.message || "Failed to create project";
          setError(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
              <FolderPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Create new project</h2>
              <p className="text-xs text-white/40">Register a new Expo / React Native application.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 rounded text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Project Name / Slug <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder=""
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400/60 transition-all font-mono"
            />
            <p className="text-[10px] text-white/30">
              Matches your Expo app name in <code className="text-white/50">app.json</code>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-white/50">
              Custom Scheme <span className="text-white/30">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. myapp"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-400/60 transition-all font-mono"
            />
            <p className="text-[10px] text-white/30">Deep linking URL scheme (e.g. myapp://)</p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded bg-white text-black text-xs font-bold hover:bg-white/90 disabled:opacity-40 transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
