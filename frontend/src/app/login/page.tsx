"use client";

import { useState, useRef, useEffect } from "react";
import { CloudLightning, KeyRound, Eye, EyeOff, Loader2, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
              ? "Invalid email or password."
              : "Connection error. Please try again.";
          setError(msg);
          setPassword("");
        },
      },
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Subtle texture background */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div
        className={`relative z-10 w-full max-w-md px-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="rounded-lg border border-white/[0.08] bg-[#050505] p-10 shadow-2xl">
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center gap-4">
            <Link href="/" className="flex h-12 w-12 items-center justify-center rounded bg-white">
              <CloudLightning className="h-6 w-6 text-black fill-black" />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tighter text-white">
                Log in to ZenOTA
              </h1>
              <p className="mt-1 text-sm text-white/40 font-medium">
                Enter your details to access your dashboard.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                required
                className="w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-white/30"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Password</label>
                <a href="#" className="text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded border border-white/10 bg-white/[0.03] px-4 py-3 pr-12 text-sm font-medium outline-none transition-all focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !email || !password}
              className="group w-full flex items-center justify-center gap-2 rounded bg-white py-3.5 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-40"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Log in</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] font-medium text-white/40 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
