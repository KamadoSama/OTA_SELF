"use client";

import { useState, useEffect, Suspense } from "react";
import { CloudLightning, Eye, EyeOff, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { useRegister } from "@/hooks/useAuth";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthButton } from "@/components/ui/auth-button";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const { register: registerField, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { mutate: register, isPending } = useRegister();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: RegisterValues) => {
    setError("");
    register(
      { email: data.email, password: data.password, plan: plan || 'FREE' },
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
        },
      },
    );
  };

  const handleGoogleSignUp = () => {
    setIsGoogleLoading(true);
    const callbackUrl = plan === "pro" ? "/dashboard/subscription?setup=pro" : "/dashboard";
    signIn("google", { callbackUrl });
  };

  const isSelfHosted = process.env.NEXT_PUBLIC_SELF_HOSTED === "true";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
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
          <div className="mb-10 flex flex-col items-center gap-4">
            <Link href={isSelfHosted ? "/dashboard" : "/"} className="flex h-12 w-12 items-center justify-center rounded bg-white">
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
              disabled={isGoogleLoading || isPending}
              className="w-full flex items-center justify-center gap-3 rounded border border-white/10 bg-white/[0.03] py-3 text-sm font-bold text-white transition-all hover:bg-white/5 disabled:opacity-40"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Icon icon="logos:google-icon" className="h-5 w-5" />
                  <span>Sign up with Google</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/[0.08]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">or</span>
              <div className="h-[1px] flex-1 bg-white/[0.08]" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Work Email</label>
              <input
                id="email"
                type="email"
                {...registerField("email")}
                placeholder="developer@example.com"
                className={`w-full rounded border ${errors.email ? 'border-red-500/50' : 'border-white/10'} bg-white/[0.03] px-4 py-3 text-sm font-medium outline-none transition-all focus:border-white/30`}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Secure Password</label>
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

            {error && (
              <div className="rounded border border-red-500/20 bg-red-500/5 px-4 py-3 text-[13px] font-medium text-red-400">
                {error}
              </div>
            )}

            <AuthButton isLoading={isPending}>
              Create Account
            </AuthButton>
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/20" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
