"use client";

import { useState } from "react";
import { Key, ShieldCheck, Terminal, Copy, Check } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ApiKeyTable } from "../components/ApiKeyTable";
import { ApiKeyModal } from "../components/ApiKeyModal";
import { DeleteConfirmationDialog } from "../components/DeleteConfirmationDialog";
import { useApiKeys, useGenerateApiKey, useDeleteApiKey } from "@/hooks/useApiKeys";
import { useSubscription } from "@/hooks/useUpdates";

export default function ApiKeysPage() {
  const { data: stats } = useSubscription();
  const { data: apiKeys = [], isLoading: isLoadingKeys, refetch: refetchKeys } = useApiKeys();
  const { mutate: generateKey, isPending: isGeneratingKey } = useGenerateApiKey();
  const { mutate: deleteKey } = useDeleteApiKey();

  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "key" } | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

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
      },
    });
  };

  const handleConfirmCopy = () => {
    setNewRawKey(null);
    setShowKeyDialog(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteKey(itemToDelete.id);
    setItemToDelete(null);
  };

  const copyCliCommand = () => {
    navigator.clipboard.writeText("npx zenota login");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
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

      <Navbar onRefresh={() => refetchKeys()} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 max-w-7xl space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.06] pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">API Keys</h1>
                <p className="text-xs text-white/50">
                  Manage personal access tokens to authenticate with ZenOTA CLI and automated CI/CD pipelines.
                </p>
              </div>
            </div>
          </div>

          {/* Quick CLI helper pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-mono text-white/70">
            <Terminal className="h-3.5 w-3.5 text-white/40" />
            <span>npx zenota login</span>
            <button
              onClick={copyCliCommand}
              className="ml-2 text-white/40 hover:text-white transition-colors"
              title="Copy command"
            >
              {copiedCli ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* API Key Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ApiKeyTable
            isLoading={isLoadingKeys}
            apiKeys={apiKeys}
            onGenerateKey={handleGenerateKey}
            onDeleteItem={(id) => setItemToDelete({ id, type: "key" })}
            isGeneratingKey={isGeneratingKey}
            error={keyError}
            activeKeysCount={stats?.activeApiKeys || apiKeys.length}
            keysLimit={stats?.apiKeysLimit || 0}
          />
        </div>
      </main>
    </div>
  );
}
