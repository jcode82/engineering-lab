"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const BottleneckChart = dynamic(() => import("./BottleneckChart"), {
  ssr: false,
});

interface SamplePoint {
  id: number;
  latency: number;
}

type Scenario = "baseline" | "slow" | "optimized";

const scenarioLabels: Record<Scenario, string> = {
  baseline: "Baseline Query",
  slow: "Slow (Bottleneck)",
  optimized: "Optimized Query",
};

export default function BottleneckPanel() {
  const [scenario, setScenario] = useState<Scenario>("baseline");
  const [samples, setSamples] = useState<SamplePoint[]>([]);
  const [loading, setLoading] = useState(false);

  async function runTest() {
    setLoading(true);
    setSamples([]);

    const newSamples: SamplePoint[] = [];

    for (let i = 0; i < 10; i += 1) {
      const res = await fetch(`/api/bottleneck?scenario=${scenario}`);
      const json = await res.json();
      newSamples.push({ id: i + 1, latency: json.latency });
    }

    setSamples(newSamples);
    setLoading(false);
  }

  const sorted = [...samples].sort((a, b) => a.latency - b.latency);
  const p95 =
    sorted.length > 0
      ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))]
          .latency
      : null;

  return (
    <div
      className="p-6 rounded-2xl border border-[var(--border)]/60 bg-[var(--surface)]/70 dark:bg-black/40 backdrop-blur-md shadow-lg shadow-black/5"
    >
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value as Scenario)}
          className="px-3 py-2 rounded-md bg-[var(--surface)] border border-[var(--border)] text-sm"
        >
          {(
            ["baseline", "slow", "optimized"] as Scenario[]
          ).map((value) => (
            <option key={value} value={value}>
              {scenarioLabels[value]}
            </option>
          ))}
        </select>

        <button
          onClick={runTest}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-primary-400 disabled:opacity-40 transition"
        >
          {loading ? "Running…" : "Run Test"}
        </button>
      </div>

      {samples.length > 0 && (
        <div className="mt-6 h-[260px]">
          <BottleneckChart samples={samples} />
        </div>
      )}

      {samples.length > 0 && (
        <div className="mt-6 text-sm opacity-80">
          <p>
            {scenarioLabels[scenario]} p95 latency:
            <span className="font-semibold ml-1">
              {p95 ? `${p95} ms` : "--"}
            </span>
          </p>
        </div>
      )}

      {samples.length === 0 && (
        <p className="text-sm opacity-70">
          Run the benchmark to capture 10 query samples for the selected scenario.
        </p>
      )}
    </div>
  );
}
