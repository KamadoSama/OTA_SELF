"use client";

import { Key } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  apiKey: string | null;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, apiKey, onClose }: ApiKeyModalProps) {
  if (!isOpen || !apiKey) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight mb-4 text-center sm:text-left">API Key Generated</h2>
        <p className="text-sm text-white/40 mb-6 text-center sm:text-left">
          Copy this key now. For security reasons, <span className="text-white font-bold">it will not be shown again.</span>
        </p>
        <div className="flex items-center gap-2 p-4 rounded bg-white/5 border border-white/10 mb-8 font-mono text-xs break-all text-white/90">
          <Key className="h-4 w-4 text-white/20 shrink-0" />
          {apiKey}
        </div>
        <button 
          onClick={handleCopy}
          className="w-full rounded bg-white py-3 text-sm font-bold text-black hover:bg-white/90 transition-all"
        >
          Copy and Close
        </button>
      </div>
    </div>
  );
}
