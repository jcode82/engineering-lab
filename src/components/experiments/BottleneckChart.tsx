"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BottleneckChartProps {
  samples: Array<{ id: number; latency: number }>;
}

export default function BottleneckChart({ samples }: BottleneckChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={samples} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="4 4" />
        <XAxis dataKey="id" stroke="var(--muted)" tickLine={false} />
        <YAxis stroke="var(--muted)" tickLine={false} tickFormatter={(value) => `${value}ms`} />
        <Tooltip
          contentStyle={{ background: "rgba(15,23,42,0.8)", border: "none", borderRadius: 12 }}
          labelFormatter={(label) => `Sample ${label}`}
          formatter={(value: number) => [`${value} ms`, "Latency"]}
        />
        <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
