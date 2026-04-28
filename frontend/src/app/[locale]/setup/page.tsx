"use client";

import { useState, useEffect, Suspense } from "react";
import { CloudLightning, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useRegister } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { AuthButton } from "@/components/ui/auth-button";

const setupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SetupValues = z.infer<typeof setupSchema>;

function SetupForm() {
  const t = useTranslations("Setup");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { 
    register: registerField, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<SetupValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { mutate: register, isPending } = useRegister();

  // TanStack Query for setup status check
  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ["setupStatus"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/setup/status");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status && !status.needsSetup) {
      router.push("/login");
    }
  }, [status, router]);

  const onSubmit = (data: SetupValues) => {
    setServerError("");
    register(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (err) => {
          const msg =
            axios.isAxiosError(err) && err.response?.status === 409
              ? t("errorAlreadyConfigured")
              : "Setup failed. Please check server logs.";
          setServerError(msg);
        },
      },
    );
  };

  if (isStatusLoading || !mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    );
  }

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
        className={`relative z-10 w-full max-w-md px-6 transition-all duration-700 opacity-100 translate-y-0`}
      >
        <div className="rounded-lg border border-white/[0.08] bg-[#050505] p-10 shadow-2xl">
          {/* Logo */}
          <div className="mb-10 flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white">
              <CloudLightning className="h-6 w-6 text-black fill-black" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tighter text-white">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-white/40 font-medium">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                {...registerField("email")}
                placeholder="admin@yourdomain.com"
                className={`w-full rounded border ${errors.email ? 'border-red-500/50' : 'border-white/10'} bg-white/[0.03] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-white/30`}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...registerField("password")}
                  placeholder="••••••••••••"
                  className={`w-full rounded border ${errors.password ? 'border-red-500/50' : 'border-white/10'} bg-white/[0.03] px-4 py-3 pr-12 text-sm font-medium outline-none transition-all focus:border-white/30`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400">
                {serverError}
              </div>
            )}

            <AuthButton isLoading={isPending}>
              {t("submit")}
            </AuthButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    }>
      <SetupForm />
    </Suspense>
  );
}
