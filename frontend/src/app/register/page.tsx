"use client";

import { useState, useRef, useEffect } from "react";
import { CloudLightning, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate: register, isPending } = useRegister();

  useEffect(() => {
    setMounted(true);
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    register(
      { email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (err) => {
          const msg =
            axios.isAxiosError(err) && err.response?.status === 409
              ? "Account already exists with this email."
              : "Registration failed. Please try again.";
          setError(msg);
          setPassword("");
        },
      },
    );
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" });
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
                Create your ZenOTA account
              </h1>
              <p className="mt-1 text-sm text-white/40 font-medium">
                Join the professional OTA deployment platform.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 rounded border border-white/10 bg-white/[0.03] py-3 text-sm font-bold text-white transition-all hover:bg-white/5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/[0.08]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">or</span>
              <div className="h-[1px] flex-1 bg-white/[0.08]" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Work Email</label>
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
              <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Secure Password</label>
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
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] font-medium text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
