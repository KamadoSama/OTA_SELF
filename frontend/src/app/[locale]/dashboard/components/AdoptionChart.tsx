"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Users, Smartphone, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { Icon } from "@iconify/react";
import { useAnalytics } from "@/hooks/useUpdates";

interface AdoptionChartProps {
  appName?: string;
}

export function AdoptionChart({ appName }: AdoptionChartProps) {
  const [days, setDays] = useState<7 | 14 | 30>(14);
  const { data, isLoading } = useAnalytics(days, appName);

  const history = data?.history || [];
  const totalUnique = data?.totalUniqueDevices || 0;

  // Calculate total installs in selected period
  const periodInstalls = history.reduce((acc, curr) => acc + curr.total, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded-lg shadow-2xl backdrop-blur-md space-y-2 min-w-[160px]">
          <p className="text-[11px] font-mono text-white/40 border-b border-white/5 pb-1">
            {label}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name === "total"
                    ? "Total Installs"
                    : entry.name === "ios"
                    ? "iOS Devices"
                    : "Android Devices"}
                </span>
                <span className="font-mono font-bold text-white">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded border border-white/[0.06] bg-[#050505] p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/90">
              Live Adoption & Verified Installations
            </h2>
          </div>
          <p className="text-xs text-white/40">
            Real unique devices receiving updates — zero estimation, 100% verified hardware hashes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 p-1 rounded-lg self-start sm:self-auto">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                days === d
                  ? "bg-white text-black shadow-sm"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Metrics mini-bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-y border-white/[0.04] py-3">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30 flex items-center gap-1">
            <Users className="h-3 w-3 text-cyan-400" /> All-Time Devices
          </span>
          <div className="text-xl font-bold font-mono tracking-tight text-white">
            {isLoading ? "..." : totalUnique.toLocaleString()}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/30 flex items-center gap-1">
            <Smartphone className="h-3 w-3 text-white/40" /> Installs ({days}d)
          </span>
          <div className="text-xl font-bold font-mono tracking-tight text-cyan-400">
            {isLoading ? "..." : `+${periodInstalls.toLocaleString()}`}
          </div>
        </div>

        <div className="hidden sm:flex flex-col justify-center space-y-1">
          <div className="flex items-center gap-4 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Total
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" /> iOS
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Android
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white/20" />
          </div>
        ) : history.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/30 font-medium">
            No installation events recorded for this period yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={history}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorIos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorAndroid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff"
                strokeOpacity={0.04}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#ffffff"
                strokeOpacity={0.2}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(str) => {
                  try {
                    const parts = str.split("-");
                    return `${parts[1]}/${parts[2]}`;
                  } catch {
                    return str;
                  }
                }}
              />
              <YAxis
                stroke="#ffffff"
                strokeOpacity={0.2}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="total"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="ios"
                name="ios"
                stroke="#ffffff"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorIos)"
              />
              <Area
                type="monotone"
                dataKey="android"
                name="android"
                stroke="#10b981"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorAndroid)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
