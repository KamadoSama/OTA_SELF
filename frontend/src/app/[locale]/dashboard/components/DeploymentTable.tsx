"use client";

import { Smartphone, DownloadCloud, Trash2, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { Update } from "@/services/updates.service";

interface DeploymentTableProps {
  isLoading: boolean;
  updates: Update[];
  deletingId: string | null;
  onDeleteItem: (id: string, type: 'update') => void;
  isActive: (u: Update) => boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export function DeploymentTable({
  isLoading,
  updates,
  deletingId,
  onDeleteItem,
  isActive,
  pagination,
  onPageChange,
}: DeploymentTableProps) {
  return (
    <div className="rounded border border-white/[0.06] bg-[#050505] overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/80">Deploy History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-white/30 font-medium">
              <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">App</th>
              <th className="hidden sm:table-cell px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Runtime</th>
              <th className="hidden lg:table-cell px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-center">Stats</th>
              <th className="hidden md:table-cell px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="px-6 py-5"><div className="h-3 w-full bg-white/5 rounded" /></td>
                </tr>
              ))
            ) : updates.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center text-white/20 font-medium">No updates found.</td>
              </tr>
            ) : updates.map((update: Update) => (
              <tr key={update.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                  <div className="font-bold tracking-tight">{update.channel.app.name}</div>
                  <div className="sm:hidden text-[10px] text-white/30 font-bold uppercase mt-1">{update.channel.name}</div>
                </td>
                <td className="hidden sm:table-cell px-6 py-5">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-bold lowercase tracking-wide">
                    {update.channel.name}
                  </span>
                </td>
                <td className="px-6 py-5 font-mono text-white/60">{update.runtimeVersion}</td>
                <td className="hidden lg:table-cell px-6 py-5">
                  <div className="flex items-center gap-2.5">
                    {update.platform === "ios" ? (
                      <Icon icon="fa6-brands:apple" className="h-4 w-4 text-white" />
                    ) : (
                      <Icon icon="fa6-brands:android" className="h-4 w-4 text-emerald-400" />
                    )}
                    <span className="font-medium capitalize">{update.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <DownloadCloud className="h-3.5 w-3.5 text-white/20" />
                    <span className="font-mono text-[11px] font-bold">{update.downloadCount || 0}</span>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-5 text-white/30">{new Date(update.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5">
                  {isActive(update) ? (
                    <div className="flex items-center gap-2 text-white">
                      <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Active</span>
                    </div>
                  ) : (
                    <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Archived</span>
                  )}
                  <div className="sm:hidden flex items-center gap-2">
                    {isActive(update) ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => onDeleteItem(update.id, 'update')} 
                    disabled={deletingId === update.id}
                    className="p-2 rounded border border-white/10 text-white/20 hover:text-white hover:border-white/30 transition-all disabled:opacity-30"
                  >
                    {deletingId === update.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 bg-white/[0.02]">
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/20">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              className="px-3 py-1.5 rounded border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                // Simple logic for showing 5 pages around current
                let pageNum = pagination.page;
                if (pagination.totalPages <= 5) pageNum = i + 1;
                else {
                   if (pagination.page <= 3) pageNum = i + 1;
                   else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                   else pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => onPageChange?.(pageNum)}
                    className={`h-7 w-7 rounded text-[10px] font-bold transition-all ${
                      pagination.page === pageNum ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              className="px-3 py-1.5 rounded border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
