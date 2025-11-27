"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Scenario = "baseline" | "cached" | "pooled";

interface ExperimentChartProps {
  scenario?: Scenario;
}

const DATA_BY_SCENARIO: Record<Scenario, { t: number; p95: number }[]> = {
  baseline: [
    { t: 0, p95: 320 },
    { t: 1, p95: 310 },
    { t: 2, p95: 305 },
    { t: 3, p95: 315 },
    { t: 4, p95: 300 },
  ],
  cached: [
    { t: 0, p95: 180 },
    { t: 1, p95: 170 },
    { t: 2, p95: 165 },
    { t: 3, p95: 160 },
    { t: 4, p95: 155 },
  ],
  pooled: [
    { t: 0, p95: 95 },
    { t: 1, p95: 90 },
    { t: 2, p95: 88 },
    { t: 3, p95: 85 },
    { t: 4, p95: 82 },
  ],
};

export function ExperimentChart({ scenario = "baseline" }: ExperimentChartProps) {
  const data = DATA_BY_SCENARIO[scenario];

  const label =
    scenario === "baseline"
      ? "Baseline (no caching)"
      : scenario === "cached"
      ? "Cached"
      : "Pooled connections";

  return (
    <div className="my-6 rounded-2xl border border-[var(--border)]/80 bg-[var(--surface)]/60 p-4 md:p-5">
      <div className="mb-2 text-sm font-medium text-[var(--muted)]">
        p95 Latency · {label}
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, right: 8, top: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="t"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              label={{
                value: "ms (p95)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
