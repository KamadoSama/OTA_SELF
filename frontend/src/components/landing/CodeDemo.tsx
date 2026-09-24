"use client";

import { useState } from "react";
import { Copy, Check, Terminal, RotateCcw, Server, FileCode } from "lucide-react";

export function CodeDemo() {
  const [activeTab, setActiveTab] = useState<'publish' | 'rollback' | 'selfhost' | 'config'>('publish');
  const [copied, setCopied] = useState(false);

  const snippets: Record<string, string> = {
    publish: "npx zenota publish --channel production --rollout 25",
    rollback: "npx zenota rollback --channel production",
    selfhost: "curl -fsSL https://get-zenota.diesestudio.com | sh",
    config: `{
  "expo": {
    "name": "my-expo-app",
    "updates": {
      "url": "https://api-zenota.diesestudio.com/api/update/manifest/my-app"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}`
  };

  const copyCurrent = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl glass rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative z-10 bg-black/60 backdrop-blur-2xl">
      {/* Header Tabs */}
      <div className="h-12 bg-white/[0.03] border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'publish'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              publish
            </button>

            <button
              onClick={() => setActiveTab('rollback')}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'rollback'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              rollback
            </button>

            <button
              onClick={() => setActiveTab('selfhost')}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'selfhost'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              self-host
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'config'
                  ? 'bg-white/15 text-white font-semibold shadow-sm'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              app.json
            </button>
          </div>
        </div>

        <button
          onClick={copyCurrent}
          aria-label="Copy code"
          className="text-xs text-white/40 hover:text-white p-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1 font-mono"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline text-[11px]">{copied ? 'copied' : 'copy'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-[13px] leading-relaxed min-h-[260px] flex flex-col justify-between">
        {activeTab === 'publish' && (
          <div className="space-y-1.5 animate-in fade-in duration-300">
            <div className="text-white/60 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">$</span>
              <span className="text-white font-semibold">npx zenota publish --channel production --rollout 25</span>
            </div>
            <div className="text-white/40">✓ Exporting Expo bundle (iOS · Android · Hermes) <span className="text-white/20">0.9s</span></div>
            <div className="text-white/40">✓ Hashing and uploading assets (24 files · 3.8 MB) <span className="text-white/20">1.2s</span></div>
            <div className="text-blue-400 font-medium">ℹ Canary rollout set to 25% of deterministic device cohort</div>
            <div className="text-emerald-400 font-bold pt-2 flex items-center gap-2">
              <span>✨</span>
              <span>Update <code className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">v2.4.1</code> is LIVE on channel [production]</span>
            </div>
            <div className="text-white/30 text-xs pt-1">
              Deterministic device assignment: 25% devices get v2.4.1, 75% stay on stable v2.4.0
            </div>
          </div>
        )}

        {activeTab === 'rollback' && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="text-white/60 flex items-center gap-2">
              <span className="text-amber-400 font-bold">$</span>
              <span className="text-white font-semibold">npx zenota rollback --channel production</span>
            </div>
            <div className="text-white/40">ℹ Identifying latest active update on channel "production"...</div>
            <div className="text-white/40">✓ Revoked update ID: <span className="text-white/70">f94d81ec-5002</span></div>
            <div className="text-amber-300 font-bold pt-2 flex items-center gap-2">
              <span>↩</span>
              <span>Instant Rollback complete in 180ms!</span>
            </div>
            <div className="text-white/40 text-xs">
              Channel "production" restored to stable version <code className="bg-white/10 text-white px-1.5 py-0.5 rounded">v2.4.0</code> without rebuilding bundles.
            </div>
          </div>
        )}

        {activeTab === 'selfhost' && (
          <div className="space-y-2 animate-in fade-in duration-300">
            <div className="text-white/60 flex items-center gap-2">
              <span className="text-blue-400 font-bold">$</span>
              <span className="text-white font-semibold">curl -fsSL https://get-zenota.diesestudio.com | sh</span>
            </div>
            <div className="text-white/40">📥 Downloading ZenOTA Community CLI for macOS / Linux...</div>
            <div className="text-white/40">✓ Binary installed to /usr/local/bin/zenota</div>
            <div className="text-blue-400 font-bold pt-2 flex items-center gap-2">
              <span>🚀</span>
              <span>ZenOTA Community Server installed!</span>
            </div>
            <div className="text-emerald-400 text-xs font-semibold">
              $ zenota init <span className="text-white/40 font-normal">→ Configures Docker, Postgres & MinIO storage in 60s.</span>
            </div>
            <div className="text-white/30 text-[11px]">
              Unlimited devices. Zero MAU caps. 100% data sovereignty on your VPS.
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="animate-in fade-in duration-300">
            <pre className="text-white/70 font-mono text-[12px] leading-relaxed">
              <code>{snippets.config}</code>
            </pre>
          </div>
        )}

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>zenota-edge · protocol v0/v1 compatible</span>
          </div>
          <span className="hidden sm:inline">zero-config react native expo</span>
        </div>
      </div>
    </div>
  );
}
