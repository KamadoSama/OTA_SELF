"use client";

import { RotateCcw, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { Update } from "@/services/updates.service";

interface RollbackDialogProps {
  update: Update | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function RollbackDialog({
  update,
  onConfirm,
  onCancel,
  isPending = false,
}: RollbackDialogProps) {
  if (!update) return null;

  const isAlreadyRollback = Boolean(update.isRollback);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] rounded-xl border border-white/10 bg-[#080808] p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${
              isAlreadyRollback
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            <RotateCcw className={`h-6 w-6 ${isPending ? "animate-spin" : ""}`} />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white mb-2">
            {isAlreadyRollback ? "Restaurer cette version ?" : "Rollback en 1-clic ?"}
          </h2>

          <div className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] p-3.5 mb-5 text-left text-xs space-y-1.5">
            <div className="flex justify-between items-center text-white/50">
              <span>Application :</span>
              <span className="font-bold text-white/90">{update.channel.app.name}</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>Canal :</span>
              <span className="font-mono text-cyan-400 lowercase font-semibold">{update.channel.name}</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>Runtime / Version :</span>
              <span className="font-mono text-white/80">{update.runtimeVersion}</span>
            </div>
            <div className="flex justify-between items-center text-white/50">
              <span>Plateforme :</span>
              <span className="capitalize text-white/80">{update.platform}</span>
            </div>
          </div>

          <p className="text-[12px] text-white/40 mb-7 leading-relaxed">
            {isAlreadyRollback
              ? "Cette version sera réactivée. Les applications mobiles connectées recommenceront à télécharger cette mise à jour."
              : "Cette version sera immédiatement désactivée. Les applications Expo repasseront automatiquement sur la version précédente saine sans interruption."}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`w-full rounded-lg py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isAlreadyRollback
                ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
            <span>
              {isPending
                ? "Application en cours..."
                : isAlreadyRollback
                ? "Confirmer la Restauration"
                : "Confirmer le Rollback Immédiat"}
            </span>
          </button>

          <button
            onClick={onCancel}
            disabled={isPending}
            className="w-full rounded-lg border border-white/5 py-2.5 text-xs font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
