"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

type LatencyPoint = { t: number; p95: number };
type ReplicaLoad = { load: number };
type ErrorPoint = { t: number; err: number };

type DashboardData = {
  cpu: number;
  mem: number;
  latency: LatencyPoint[];
  replicas: ReplicaLoad[];
  errors: ErrorPoint[];
};

const INITIAL_DATA: DashboardData = {
  cpu: 40,
  mem: 55,
  latency: [],
  replicas: [],
  errors: [],
};

function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || navigator.vendor || "";
    const appleDevice =
      /iPhone|iPad|iPod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(appleDevice);
  }, []);

  return isIOS;
}

export default function LabDashboard() {
  const isIOS = useIsIOS();

  return (
    <section
      className="relative margin-bottom-15px overflow-hidden rounded-none min-h-[700px] md:h-[700px]"
      style={{
        backgroundImage: "url('/images/lab_desk_v2.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: isIOS ? "scroll" : "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[var(--surface)]/45" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <DashboardContent />
      </div>
    </section>
  );
}

function DashboardContent() {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);

  useEffect(() => {
    const generate = () => {
      const nextCpu = 30 + Math.random() * 60;
      const nextMem = 30 + Math.random() * 60;

      setData((prev) => ({
        cpu: lerp(prev.cpu, nextCpu, 0.4),
        mem: lerp(prev.mem, nextMem, 0.4),
        latency: createLatency(),
        replicas: createReplicas(),
        errors: createErrors(),
      }));
    };

    generate();
    const id = setInterval(generate, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <h2 className="mb-12 text-center text-3xl font-semibold text-[var(--text)]">
        Laboratory Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Glass title="System Reactor">
          <ReactorPulse cpu={data.cpu} mem={data.mem} />
        </Glass>

        <Glass title="Latency (p95)">
          <MiniSpark data={data.latency} dataKey="p95" color="var(--cyan)" />
        </Glass>

        <Glass title="Replica Load">
          <MiniBars items={data.replicas} />
        </Glass>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Glass title="Error Bursts">
          <MiniSpark data={data.errors} dataKey="err" color="var(--rose)" />
        </Glass>

        <Glass title="Resources">
          <MiniDials cpu={data.cpu} mem={data.mem} />
        </Glass>

        <Glass title="Timeline">
          <MiniTimeline cpu={data.cpu} mem={data.mem} />
        </Glass>
      </div>
    </>
  );
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
const SPARK_POINTS = 20;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function createLatency(): LatencyPoint[] {
  return Array.from({ length: SPARK_POINTS }).map((_, i) => ({
    t: i,
    p95: 120 + Math.random() * 160,
  }));
}

function createReplicas(): ReplicaLoad[] {
  return Array.from({ length: 5 }).map(() => ({
    load: 10 + Math.random() * 80,
  }));
}

function createErrors(): ErrorPoint[] {
  return Array.from({ length: SPARK_POINTS }).map((_, i) => ({
    t: i,
    err: Math.random() * (i > 12 ? 8 : 4),
  }));
}

// ---------------------------------------------------------------
// Glass wrapper
// ---------------------------------------------------------------
function Glass({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_25px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 bg-[radial-gradient(circle_at_center,var(--cyan),transparent_70%)] opacity-50 blur-2xl"
      />
      <h3 className="mb-3 text-sm font-medium text-[var(--text-muted)]">{title}</h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------
// Reactor Pulse Animation
// ---------------------------------------------------------------
function ReactorPulse({ cpu, mem }: { cpu: number; mem: number }) {
  const intensity = Math.min(1, (cpu + mem) / 200);

  return (
    <div className="relative flex h-24 items-center justify-center">
      <div
        className="h-20 w-20 rounded-full blur-xl transition-transform duration-700 ease-out"
        style={{
          background: "rgba(56,189,248,0.35)",
          transform: `scale(${1 + intensity * 0.25})`,
        }}
      />
      <div
        className="absolute h-12 w-12 rounded-full blur-md opacity-70"
        style={{
          background: "rgba(34,211,238,0.45)",
          animation: "pulse 2.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------
// Sparkline Chart
// ---------------------------------------------------------------
type MiniSparkProps<T> = {
  data: T[];
  dataKey: keyof T;
  color: string;
};

function MiniSpark<T extends Record<string, number>>({
  data,
  dataKey,
  color,
}: MiniSparkProps<T>) {
  return (
    <div className="h-24 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey as string}
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------------------------------------------------------------
// Replica Load Bars
// ---------------------------------------------------------------
function MiniBars({ items }: { items: ReplicaLoad[] }) {
  return (
    <div className="flex h-24 items-end justify-between">
      {items.map((item, index) => (
        <div
          key={index}
          className="w-4 rounded-t-xl transition-all duration-500"
          style={{
            height: `${item.load}%`,
            background: "rgba(34,211,238,0.35)",
            boxShadow: "0 0 12px rgba(34,211,238,0.35)",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------
// Resource Dials
// ---------------------------------------------------------------
function MiniDials({ cpu, mem }: { cpu: number; mem: number }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Dial label="CPU" value={Math.round(cpu)} color="var(--cyan)" />
      <Dial label="MEM" value={Math.round(mem)} color="var(--emerald)" />
    </div>
  );
}

function Dial({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-16 w-16">
        <svg className="h-full w-full rotate-[-90deg]">
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
      </div>
      <span className="mt-1 text-xs text-[var(--text-muted)]">{label}</span>
      <span className="font-mono text-sm text-[var(--text)]">{value}%</span>
    </div>
  );
}

// ---------------------------------------------------------------
// Mini Timeline (just a vibe piece)
// ---------------------------------------------------------------
function MiniTimeline({ cpu, mem }: { cpu: number; mem: number }) {
  const bars = useMemo(
    () => {
      const intensity = Math.min(1, (cpu + mem) / 200);
      return Array.from({ length: 24 }).map(
        () => 20 + Math.random() * (20 + intensity * 40),
      );
    },
    [cpu, mem],
  );
  const glow = cpu > 60 || mem > 70;

  return (
    <div className="flex h-24 items-end gap-2">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-1 rounded-full transition-all"
          style={{
            height,
            background: "var(--cyan)",
            opacity: 0.6,
            boxShadow: glow ? "0 0 8px rgba(56,189,248,0.6)" : "none",
          }}
        />
      ))}
    </div>
  );
}
