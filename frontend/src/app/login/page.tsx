"use client";

import { useState, useRef, useEffect } from "react";
import { DownloadCloud, KeyRound, Eye, EyeOff, Loader2, ShieldCheck, Mail } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [mounted, setMounted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    setMounted(true);
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login(
      { email, password },
      {
        onError: (err) => {
          const msg =
            axios.isAxiosError(err) && err.response?.status === 401
              ? "Email ou mot de passe incorrect."
              : "Erreur de connexion. Vérifiez votre réseau.";
          setError(msg);
          setShake(true);
          setPassword("");
          setTimeout(() => setShake(false), 600);
        },
      },
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.6) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "blobPulse 8s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)",
            filter: "blur(80px)",
            animation: "blobPulse 10s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md px-6 transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div
          className="rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.05), 0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.15))",
                boxShadow: "0 0 30px rgba(16,185,129,0.15)",
              }}
            >
              <DownloadCloud className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <h1 className="font-mono text-2xl font-bold tracking-tight text-slate-100">
                OTA<span className="text-emerald-400">_CTRL</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 font-mono">
                Admin Dashboard · Secure Access
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-slate-400"
              >
                <Mail className="h-3 w-3 text-emerald-400" />
                Email Admin
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ota.local"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-slate-400"
              >
                <KeyRound className="h-3 w-3 text-emerald-400" />
                Mot de passe
              </label>
              <div
                style={shake ? { animation: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both" } : {}}
              >
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-3 pr-12 text-sm font-mono text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            <div
              className={`flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-mono text-red-400 transition-all duration-300 ${
                error ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden border-0 py-0"
              }`}
            >
              {error}
            </div>

            <button
              type="submit"
              disabled={isPending || !email || !password}
              className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-mono font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                boxShadow: isPending ? "none" : "0 0 20px rgba(16,185,129,0.3), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authentification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Accéder au Dashboard
                  </>
                )}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(135deg, #047857, #059669)" }}
              />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />
            <span className="text-xs text-slate-600 font-mono">OTA_CTRL v0.1</span>
            <div className="h-px flex-1 bg-slate-800" />
          </div>
          <p className="mt-3 text-center text-xs text-slate-600 font-mono">
            Self-hosted · Expo OTA · End-to-end encrypted
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blobPulse {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(20px, -20px); }
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
