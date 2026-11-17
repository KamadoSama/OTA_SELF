"use client";

import { useState, useEffect, Suspense } from "react";
import { CloudLightning, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import axios from "axios";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthButton } from "@/components/ui/auth-button";
import { useIsSelfHosted } from "@/hooks/useSelfHosted";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const t = useTranslations("ResetPassword");
  const isSelfHosted = useIsSelfHosted();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: ResetValues) => {
    if (!token) {
      setError(t("missingToken"));
      return;
    }
    setError("");
    setIsPending(true);
    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div
        className={`relative z-10 w-full max-w-md px-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="rounded-lg border border-white/[0.08] bg-[#050505] p-10 shadow-2xl">
          <div className="mb-10 flex flex-col items-center gap-4">
            <Link
              href={isSelfHosted ? "/dashboard" : "/"}
              className="flex h-12 w-12 items-center justify-center rounded bg-white"
            >
              <CloudLightning className="h-6 w-6 text-black fill-black" />
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tighter text-white">
                {isSuccess ? t("successTitle") : t("title")}
              </h1>
              <p className="mt-1 text-sm text-white/40 font-medium">
                {isSuccess ? t("successMessage") : t("subtitle")}
              </p>
            </div>
          </div>

          {!token ? (
            <div className="space-y-6">
              <div className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400 text-center">
                {t("missingToken")}
              </div>
              <Link
                href="/forgot-password"
                className="w-full flex items-center justify-center gap-2 rounded bg-white py-3 text-sm font-bold text-black transition-all hover:bg-white/90"
              >
                <span>{t("backToLogin")}</span>
              </Link>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 rounded bg-white py-3 text-sm font-bold text-black transition-all hover:bg-white/90"
              >
                <span>{t("backToLogin")}</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-[11px] font-bold uppercase tracking-widest text-white/40"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••••••"
                    className={`w-full rounded border ${
                      errors.password ? "border-red-500/50" : "border-white/10"
                    } bg-white/[0.03] px-4 py-3 pr-12 text-sm font-medium outline-none transition-all focus:border-white/30`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-bold uppercase tracking-widest text-white/40"
                >
                  {t("confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="••••••••••••"
                  className={`w-full rounded border ${
                    errors.confirmPassword ? "border-red-500/50" : "border-white/10"
                  } bg-white/[0.03] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-white/30`}
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400">
                  {error}
                </div>
              )}

              <AuthButton isLoading={isPending}>{t("submit")}</AuthButton>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>{t("backToLogin")}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white/20" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
