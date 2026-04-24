"use client";

import { User, Shield, Bell, Terminal, Server, Save, Loader2, Mail, Lock, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";
import { useDeleteAccount } from "@/hooks/useUpdates";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

export function SettingsView() {
  const [isSaving, setIsSaving] = useState(false);
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        posthog.capture("account_deleted");
        posthog.reset();
        logout(undefined, {
          onSuccess: () => router.push("/")
        });
      },
      onError: (err) => {
        posthog.captureException(err, { extra: { context: "delete_account" } });
      },
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
          <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
          <p className="text-sm text-white/40 font-medium">Manage your account preferences and security.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="flex flex-col space-y-1">
            {[
              { id: 'general', label: 'General', icon: User },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'cli', label: 'CLI & API', icon: Terminal },
              { id: 'infrastructure', label: 'Infrastructure', icon: Server },
            ].map((item) => (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded transition-all ${
                  item.id === 'general' ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3 space-y-12">
          {/* Profile Section */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight">Profile Information</h3>
              <p className="text-sm text-white/40">This information will be displayed on your invoices and account.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input 
                    type="text" 
                    defaultValue={user?.email?.split('@')[0] || "User"}
                    className="w-full bg-white/[0.03] border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input 
                    type="email" 
                    readOnly
                    value={user?.email || ""}
                    className="w-full bg-white/[0.03] border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm font-medium outline-none text-white/60 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-white/[0.06]" />

          {/* Security Section */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight">Security</h3>
              <p className="text-sm text-white/40">Keep your account secure with a strong password.</p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2 max-w-md">
                <label className="text-[11px] font-bold uppercase tracking-widest text-white/40">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
              <button className="text-sm font-bold text-white/40 hover:text-white underline underline-offset-4">
                Update password
              </button>
            </div>
          </section>

          <hr className="border-white/[0.06]" />

          {/* Preferences Section */}
          <section className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight">Preferences</h3>
              <p className="text-sm text-white/40">Customize your dashboard experience.</p>
            </div>

            <div className="space-y-4 pt-4">
              {[
                { id: 'notif-email', label: 'Email notifications on failed deployments', desc: 'Receive a detailed report when an update fails to publish.', default: true },
                { id: 'notif-usage', label: 'Usage alerts', desc: 'Notify me when I reach 80% of my monthly download limit.', default: true },
                { id: 'dev-mode', label: 'Advanced Developer Mode', desc: 'Show raw manifest data and internal asset IDs in history.', default: false },
              ].map((pref) => (
                <div key={pref.id} className="flex items-start justify-between p-4 rounded bg-white/[0.02] border border-white/[0.04]">
                  <div className="space-y-1 pr-8">
                    <div className="text-sm font-bold">{pref.label}</div>
                    <p className="text-xs text-white/30">{pref.desc}</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.default} className="sr-only peer" />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white/40"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-white/[0.06]" />

          {/* Danger Zone */}
          <section className="space-y-6 pb-20">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-red-500">Danger Zone</h3>
              <p className="text-sm text-white/40">Permanently remove your account and all data.</p>
            </div>

            <div className="rounded border border-red-500/10 bg-red-500/[0.02] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Delete Account</h4>
                  <p className="text-xs text-white/40 leading-relaxed max-w-md">
                    This will permanently delete your apps, deployments, and billing history. This action cannot be undone.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                >
                  Delete Account
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="p-4 rounded bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                  <p className="text-[11px] font-bold text-red-500 flex-1 text-center sm:text-left uppercase tracking-wider">
                    Are you absolutely sure? Everything will be deleted.
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 transition-all flex items-center gap-2"
                    >
                      {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete Everything"}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1.5 rounded bg-white/5 text-white/60 text-[10px] font-bold hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
