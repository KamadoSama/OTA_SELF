"use client";

import { Smartphone, GitBranch, Layout, Users } from "lucide-react";
import { Update, SubscriptionStats } from "@/services/updates.service";

interface StatsGridProps {
  updates: Update[];
  totalUpdates: number;
  stats?: SubscriptionStats | null;
}

export function StatsGrid({ updates, totalUpdates, stats }: StatsGridProps) {
  const totalInstalls = updates.reduce((acc, u) => acc + (u.installationsCount || 0), 0);

  const statsList = [
    { label: "Total Updates", value: totalUpdates, icon: Smartphone },
    { label: "Verified Installs", value: totalInstalls, icon: Users, highlight: true },
    { label: "Active Apps", value: stats?.activeApps || 0, icon: Layout },
    { label: "Channels", value: new Set(updates.map(u => u.channel.name)).size, icon: GitBranch },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded overflow-hidden">
      {statsList.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-black p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</span>
              <Icon className={`h-3.5 w-3.5 ${stat.highlight ? "text-cyan-400" : "text-white/20"}`} />
            </div>
            <div className={`text-2xl font-bold tracking-tight ${stat.highlight ? "text-cyan-400 font-mono" : ""}`}>
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
