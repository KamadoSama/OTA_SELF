"use client";

import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  item: { id: string; type: 'key' | 'update' } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({ item, onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-[320px] rounded border border-white/10 bg-[#080808] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Trash2 className="h-5 w-5 text-red-500" />
          </div>
          <h2 className="text-lg font-bold tracking-tight mb-2">Delete {item.type === 'key' ? 'API Key' : 'Update'}?</h2>
          <p className="text-[13px] text-white/40 mb-8 leading-relaxed">
            This action is irreversible. The {item.type === 'key' ? 'token will be invalidated' : 'deployment bundle will be removed'}.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={onConfirm}
            className="w-full rounded bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all"
          >
            Confirm Delete
          </button>
          <button 
            onClick={onCancel}
            className="w-full rounded border border-white/5 py-2.5 text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
