"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Scenario = "thrashy" | "stable";

type ScalingPoint = {
  t: number;
  load: number;
  replicas: number;
  cpu: number;
  memory: number;
};

const SCENARIO_LABELS: Record<Scenario, string> = {
  thrashy: "Aggressive Autoscaling",
  stable: "Smoothed Autoscaling",
};

export default function ScalingCharts() {
  const [scenario, setScenario] = useState<Scenario>("thrashy");
  const [data, setData] = useState<ScalingPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/scaling?scenario=${scenario}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled) setData(json.points);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [scenario]);

  const formatted = data.map((point) => ({ ...point, minute: point.t / 60 }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{SCENARIO_LABELS[scenario]}</h2>
        <div className="inline-flex rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/50 p-1">
          {( ["thrashy", "stable"] as Scenario[] ).map((option) => (
            <button
              key={option}
              onClick={() => setScenario(option)}
              className={`px-4 py-2 text-xs rounded-2xl transition ${
                scenario === option
                  ? "bg-cyan-400 text-black"
                  : "text-muted-foreground"
              }`}
            >
              {option === "thrashy" ? "Thrashy" : "Stable"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <p className="text-sm opacity-70">Simulating autoscaling behavior…</p>
      )}

      {!loading && (
        <div className="space-y-6">
          <ChartCard title="Replica Count">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="minute" tickFormatter={(v) => `${v}m`} stroke="var(--muted)" />
                <YAxis allowDecimals={false} stroke="var(--muted)" />
                <Tooltip labelFormatter={(v) => `${v} min`} />
                <Line
                  type="stepAfter"
                  dataKey="replicas"
                  stroke="rgb(34 211 238)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="CPU & Memory Utilization">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="minute" tickFormatter={(v) => `${v}m`} stroke="var(--muted)" />
                <YAxis domain={[0, 100]} stroke="var(--muted)" />
                <Tooltip labelFormatter={(v) => `${v} min`} formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#22d3ee" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="memory" name="Memory %" stroke="#f472b6" strokeWidth={2} dot={false} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Incoming Load vs Capacity">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="minute" tickFormatter={(v) => `${v}m`} stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip labelFormatter={(v) => `${v} min`} />
                <Legend />
                <Line type="monotone" dataKey="load" name="Requests/sec" stroke="#fbbf24" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="replicas" name="Replicas" stroke="#14b8a6" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border)]/70 bg-[var(--surface)]/70 backdrop-blur-xl p-5 shadow-[0_0_40px_-20px_rgba(34,211,238,0.45)]">
      <h3 className="text-sm uppercase tracking-[0.3em] text-primary-200 mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
