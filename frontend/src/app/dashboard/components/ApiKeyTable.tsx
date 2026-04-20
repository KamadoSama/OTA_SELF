"use client";

import { Key, Trash2, Loader2 } from "lucide-react";

interface ApiKeyTableProps {
  isLoading: boolean;
  apiKeys: any[];
  onGenerateKey: () => void;
  onDeleteItem: (id: string, type: 'key') => void;
  isGeneratingKey: boolean;
  error?: string | null;
  activeKeysCount?: number;
  keysLimit?: number | string;
}

export function ApiKeyTable({
  isLoading,
  apiKeys,
  onGenerateKey,
  onDeleteItem,
  isGeneratingKey,
  error,
  activeKeysCount,
  keysLimit
}: ApiKeyTableProps) {
  const isLimitReached = typeof keysLimit === 'number' && activeKeysCount !== undefined && activeKeysCount >= keysLimit;

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <p className="text-[12px] font-medium text-red-500">{error}</p>
        </div>
      )}

      {isLimitReached && !error && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <p className="text-[12px] font-medium text-orange-500/80">
              You've reached your API key limit ({activeKeysCount}/{keysLimit}). Upgrade to PRO for unlimited keys.
            </p>
          </div>
          <a href="/dashboard/subscription" className="text-[11px] font-bold text-orange-500 hover:underline">Upgrade Now</a>
        </div>
      )}

      <div className="rounded border border-white/[0.06] bg-[#050505] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] px-6 py-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/80">CLI Access Tokens</h2>
            <p className="text-[11px] text-white/30">Use these keys to authenticate via the ZenOTA CLI.</p>
          </div>
          <button 
            onClick={onGenerateKey} 
            disabled={isGeneratingKey}
            className="flex items-center justify-center gap-2 rounded border border-white/10 px-4 py-2 text-[12px] font-bold hover:bg-white/[0.05] transition-all"
          >
            {isGeneratingKey ? <Loader2 className="h-3 w-3 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
            Generate New Key
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/30 font-medium">
                <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Key Prefix</th>
                <th className="hidden sm:table-cell px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Created</th>
                <th className="hidden md:table-cell px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-5"><div className="h-3 w-full bg-white/5 rounded" /></td>
                  </tr>
                ))
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-white/20 font-medium italic">No active keys.</td>
                </tr>
              ) : apiKeys.map((key) => (
                <tr key={key.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-mono text-white/60">{key.prefix}••••••••••••</div>
                    <div className="sm:hidden text-[10px] text-white/30 mt-1">{new Date(key.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-5 text-white/30">{new Date(key.createdAt).toLocaleDateString()}</td>
                  <td className="hidden md:table-cell px-6 py-5 text-white/30">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never used"}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => onDeleteItem(key.id, 'key')}
                      className="p-2 rounded border border-white/10 text-white/20 hover:text-white hover:border-white/30 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
