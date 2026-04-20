import { FileText, BarChart3, ArrowUpRight, Loader2, Download } from "lucide-react";
import { useBilling, useDownloadInvoice } from "@/hooks/useUpdates";
import { useState } from "react";

export function BillingView() {
  const { data: invoices, isLoading } = useBilling();
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadInvoice();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    downloadPdf(id, {
      onSettled: () => setDownloadingId(null)
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-10 gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Billing History</h1>
          <p className="text-sm text-white/40 font-medium">Download and manage your past invoices.</p>
        </div>
      </div>

      <div className="rounded border border-white/[0.06] bg-[#050505] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/30 font-medium">
                {["Invoice ID", "Date", "Status", "Amount", "Actions"].map((th) => (
                  <th key={th} className="px-6 py-3 font-semibold text-[11px] uppercase tracking-wider text-white/30">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {!invoices || invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-white/20 font-medium italic">No invoices found.</td>
                </tr>
              ) : invoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5 font-mono text-white/60">
                    INV-{new Date(invoice.date).getFullYear()}-{invoice.id.slice(0, 3).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 text-white/40 font-medium">
                    {new Date(invoice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">{invoice.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold tracking-tight">
                    {invoice.amount === 0 ? 'FREE (Trial)' : `$${invoice.amount.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleDownload(invoice.id)}
                      disabled={downloadingId === invoice.id}
                      className="flex items-center gap-2 rounded border border-white/10 px-3 py-1.5 text-[11px] font-bold hover:bg-white/[0.05] transition-all text-white/40 hover:text-white disabled:opacity-50"
                    >
                      {downloadingId === invoice.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                      <span className="hidden sm:inline">Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded border border-white/[0.06] bg-white/[0.02] p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
          <BarChart3 className="h-6 w-6 text-white/20" />
        </div>
        <div className="max-w-sm mx-auto space-y-2">
          <h3 className="font-bold tracking-tight">Need custom billing?</h3>
          <p className="text-sm text-white/40 leading-relaxed">For enterprise volume, consolidated billing, or custom payment terms, please contact our support team.</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-bold text-white hover:underline underline-offset-4">
          Contact Sales <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
