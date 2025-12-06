"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface TrafficPoint {
  label: string;
  value: number;
}

export default function TrafficChart({ data }: { data: TrafficPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="4 4" />
        <XAxis dataKey="label" stroke="var(--muted)" tickLine={false} angle={-15} height={40} />
        <YAxis stroke="var(--muted)" tickLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          contentStyle={{
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(56,189,248,0.3)",
            borderRadius: 12,
          }}
          labelStyle={{ color: "#e2e8f0" }}
          formatter={(value: number) => [`${value} visits`, "Total"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#22d3ee"
          fillOpacity={1}
          fill="url(#trafficGradient)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
