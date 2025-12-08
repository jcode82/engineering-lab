"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type {
  ObservabilityPoint,
  ObservabilityLog,
  ObservabilityAlert,
} from "@/lib/server/observability";

interface MetricsResponse {
  series: ObservabilityPoint[];
}

interface LogsResponse {
  logs: ObservabilityLog[];
}

interface AlertsResponse {
  alerts: ObservabilityAlert[];
}

type Tab = "metrics" | "logs" | "alerts";

function formatTime(t: number) {
  const d = new Date(t);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ObservabilityHub() {
  const [activeTab, setActiveTab] = useState<Tab>("metrics");
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [logs, setLogs] = useState<LogsResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function refreshAll() {
    const [m, l, a] = await Promise.all([
      fetch("/api/observability/metrics?points=60&withSpike=true").then((res) =>
        res.json()
      ),
      fetch("/api/observability/logs?count=40").then((res) => res.json()),
      fetch("/api/observability/alerts").then((res) => res.json()),
    ]);

    setMetrics(m);
    setLogs(l);
    setAlerts(a);
  }

  useEffect(() => {
    refreshAll();
    if (!autoRefresh) return;
    const id = setInterval(refreshAll, 10_000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const series = metrics?.series ?? [];
  const activeAlerts = alerts?.alerts.filter((a) => a.active) ?? [];
  const resolvedAlerts = alerts?.alerts.filter((a) => !a.active) ?? [];

  return (
    <div className="mt-8 rounded-[32px] border border-[var(--border)]/80 bg-[var(--surface)]/80 dark:bg-black/40 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.45)] space-y-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
          LAB-57 • Observability Hub
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Observability Hub
            </h2>
            <p className="text-sm text-[var(--muted)]">
              A single control room view: metrics, logs, and alerts derived from the same synthetic traffic spike. No black boxes — everything here is generated in-place so the story stays honest.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={refreshAll}
              className="rounded-full border border-[var(--border)]/80 px-4 py-2 hover:border-cyan-400/70 transition"
            >
              Refresh now
            </button>
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className={`rounded-full px-4 py-2 transition border ${
                autoRefresh
                  ? "border-emerald-400/70 bg-emerald-500/10"
                  : "border-[var(--border)]/80 hover:border-cyan-400/70"
              }`}
            >
              {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
            </button>
          </div>
        </div>
      </header>

      <nav className="flex gap-2 rounded-2xl border border-[var(--border)]/70 bg-black/30 p-1 text-xs md:text-sm">
        {([
          { id: "metrics", label: "Metrics" },
          { id: "logs", label: "Logs" },
          { id: "alerts", label: "Alerts" },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-2xl px-3 py-2 transition ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-cyan-400/70 to-emerald-400/70 text-black"
                : "text-[var(--muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "metrics" && (
        <MetricsPane series={series} />
      )}

      {activeTab === "logs" && (
        <LogsPane logs={logs?.logs ?? []} />
      )}

      {activeTab === "alerts" && (
        <AlertsPane activeAlerts={activeAlerts} resolvedAlerts={resolvedAlerts} />
      )}
    </div>
  );
}

function MetricsPane({ series }: { series: ObservabilityPoint[] }) {
  const latest = series.at(-1);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <MetricCard label="CPU" value={latest?.cpu} unit="%" />
        <MetricCard label="p95 latency" value={latest?.p95} unit="ms" />
        <MetricCard label="Error rate" value={latest?.err} unit="%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="CPU & Memory">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="t" tickFormatter={formatTime} fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip labelFormatter={(value) => formatTime(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="cpu" name="CPU %" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mem" name="Memory %" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Throughput & Error Rate">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="t" tickFormatter={formatTime} fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip labelFormatter={(value) => formatTime(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="rps" name="Requests/sec" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="err" name="Error rate %" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="p95 Latency">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="t" tickFormatter={formatTime} fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip labelFormatter={(value) => formatTime(value as number)} />
            <Line type="monotone" dataKey="p95" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function LogsPane({ logs }: { logs: ObservabilityLog[] }) {
  return (
    <div className="rounded-3xl border border-[var(--border)]/80 bg-black/40 p-4">
      <div className="mb-3 text-sm text-[var(--muted)]">
        Logs are structured JSON (level, message, context) derived from the same synthetic metrics. Nothing here is random lorem ipsum.
      </div>
      <div className="max-h-[420px] overflow-auto rounded-2xl border border-[var(--border)]/60 bg-black/60">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-black/80">
            <tr className="text-[var(--muted)]">
              <th className="px-3 py-2 text-left font-normal">Time</th>
              <th className="px-3 py-2 text-left font-normal">Level</th>
              <th className="px-3 py-2 text-left font-normal">Message</th>
              <th className="px-3 py-2 text-left font-normal">Context</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx} className="border-t border-[var(--border)]/40">
                <td className="px-3 py-2 whitespace-nowrap text-[var(--muted)]">
                  {formatTime(log.ts)}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${levelBadge(log.level)}`}
                  >
                    {log.level}
                  </span>
                </td>
                <td className="px-3 py-2">{log.msg}</td>
                <td className="px-3 py-2 text-[var(--muted)]">
                  <code className="rounded bg-white/5 px-2 py-1 text-[10px]">
                    {JSON.stringify(log.context ?? {}, null, 0)}
                  </code>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-[var(--muted)]" colSpan={4}>
                  No logs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AlertsPane({
  activeAlerts,
  resolvedAlerts,
}: {
  activeAlerts: ObservabilityAlert[];
  resolvedAlerts: ObservabilityAlert[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border border-[var(--border)]/80 bg-black/45 p-4">
        <h3 className="text-sm font-semibold mb-3">Active alerts</h3>
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-[var(--border)]/70 bg-gradient-to-r from-rose-500/10 via-transparent to-amber-400/10 p-3"
            >
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide">
                <span className={`rounded-full border px-2 py-0.5 ${severityBadge(alert.severity)}`}>
                  {alert.severity} • Active
                </span>
                <span className="text-[var(--muted)]">
                  {alert.value}
                  {alert.unit}
                </span>
              </div>
              <h4 className="text-sm font-medium">{alert.title}</h4>
              <p className="text-xs text-[var(--muted)]">{alert.description}</p>
              <p className="mt-2 text-[10px] text-[var(--muted)]">
                Rule:
                <code className="ml-2 rounded bg-white/5 px-2 py-0.5">
                  {alert.rule}
                </code>
              </p>
            </div>
          ))}
          {activeAlerts.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No active alerts.</p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border)]/80 bg-black/45 p-4">
        <h3 className="text-sm font-semibold mb-3">Resolved</h3>
        <div className="space-y-3">
          {resolvedAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-2xl border border-[var(--border)]/60 bg-gradient-to-r from-emerald-500/10 to-transparent p-3"
            >
              <div className="mb-1 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                {alert.severity} • Resolved
              </div>
              <h4 className="text-sm font-medium">{alert.title}</h4>
              <p className="text-xs text-[var(--muted)]">{alert.description}</p>
            </div>
          ))}
          {resolvedAlerts.length === 0 && (
            <p className="text-sm text-[var(--muted)]">No resolved alerts logged.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit }: { label: string; value?: number; unit?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)]/70 bg-black/35 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{label}</p>
      <p className="text-2xl font-mono">
        {typeof value === "number" ? value : "—"}
        {unit && <span className="ml-1 text-sm text-[var(--muted)]">{unit}</span>}
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border)]/80 bg-black/35 p-4">
      <h4 className="mb-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">{title}</h4>
      {children}
    </div>
  );
}

function levelBadge(level: ObservabilityLog["level"]) {
  switch (level) {
    case "INFO":
      return "border-emerald-400 text-emerald-300";
    case "WARN":
      return "border-amber-400 text-amber-200";
    case "ERROR":
      return "border-rose-400 text-rose-200";
  }
}

function severityBadge(severity: ObservabilityAlert["severity"]) {
  switch (severity) {
    case "low":
      return "border-emerald-400 text-emerald-300";
    case "medium":
      return "border-amber-400 text-amber-300";
    case "high":
      return "border-rose-400 text-rose-300";
  }
}
