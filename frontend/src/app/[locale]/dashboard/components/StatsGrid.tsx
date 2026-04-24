"use client";

import { Smartphone, GitBranch, Activity, Shield } from "lucide-react";
import { Update } from "@/services/updates.service";

interface StatsGridProps {
  updates: Update[];
}

export function StatsGrid({ updates }: StatsGridProps) {
  const stats = [
    { label: "Total Updates", value: updates.length, icon: Smartphone },
    { label: "Channels", value: new Set(updates.map(u => u.channel.name)).size, icon: GitBranch },
    { label: "API Uptime", value: "99.9%", icon: Activity },
    // { label: "Storage", value: "MinIO S3", icon: Shield }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded overflow-hidden">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-black p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</span>
              <Icon className="h-3.5 w-3.5 text-white/20" />
            </div>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
