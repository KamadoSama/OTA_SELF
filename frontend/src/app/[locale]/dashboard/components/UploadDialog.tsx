"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useUploadUpdate } from "@/hooks/useUpdates";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDialog({ isOpen, onClose }: UploadDialogProps) {
  const [appName, setAppName] = useState("my-app");
  const [channelName, setChannelName] = useState("production");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { mutate: uploadUpdate, isPending: isUploading } = useUploadUpdate();

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadUpdate(
      { file: selectedFile, appName, channelName },
      {
        onSuccess: () => {
          onClose();
          setSelectedFile(null);
        },
        onError: (err) => {},
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded border border-white/10 bg-[#080808] p-6 sm:p-10 shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors">
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
  );
}
