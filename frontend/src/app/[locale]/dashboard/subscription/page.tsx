"use client";

import { useLogout } from "@/hooks/useAuth";
import { Navbar } from "../components/Navbar";
import { SubscriptionView } from "../components/SubscriptionView";

export default function SubscriptionPage() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Texture background */}
      <div
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <Navbar 
        isLoggingOut={isLoggingOut}
        onLogout={logout}
      />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10 max-w-7xl">
        <SubscriptionView />
      </main>
    </div>
  );
}
