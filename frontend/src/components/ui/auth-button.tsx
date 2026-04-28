import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
}

export function AuthButton({ isLoading, children, className, disabled, ...props }: AuthButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        "group w-full flex items-center justify-center gap-2 rounded bg-white py-3.5 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-40",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}
