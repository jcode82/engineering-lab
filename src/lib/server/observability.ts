export type ObservabilityPoint = {
  t: number;
  cpu: number;
  mem: number;
  rps: number;
  err: number;
  p95: number;
};

export type ObservabilityLog = {
  level: "INFO" | "WARN" | "ERROR";
  msg: string;
  ts: number;
  context?: Record<string, unknown>;
};

export type ObservabilityAlert = {
  id: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  value: number;
  unit?: string;
  rule: string;
  active: boolean;
  startedAt: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function withNoise(base: number, magnitude: number) {
  return base + (Math.random() - 0.5) * 2 * magnitude;
}

export function generateObservabilitySeries(
  points = 60,
  opts?: { withSpike?: boolean }
) {
  const now = Date.now();
  const stepMs = 10 * 1000;

  const spikeIndex = opts?.withSpike
    ? Math.floor(points * randBetween(0.3, 0.8))
    : -1;

  const series: ObservabilityPoint[] = [];

  let cpuBase = randBetween(25, 45);
  let memBase = randBetween(45, 65);
  let rpsBase = randBetween(80, 140);
  let errBase = randBetween(0.1, 0.8);
  let p95Base = randBetween(140, 260);

  for (let i = 0; i < points; i++) {
    const t = now - (points - 1 - i) * stepMs;

    cpuBase = clamp(withNoise(cpuBase, 1.5), 10, 90);
    memBase = clamp(withNoise(memBase, 1.2), 30, 95);
    rpsBase = clamp(withNoise(rpsBase, 6), 30, 260);
    errBase = clamp(withNoise(errBase, 0.2), 0, 20);
    p95Base = clamp(withNoise(p95Base, 15), 80, 650);

    let cpu = cpuBase;
    let mem = memBase;
    let rps = rpsBase;
    let err = errBase;
    let p95 = p95Base;

    if (opts?.withSpike && i >= spikeIndex && i <= spikeIndex + 6) {
      const spikeProgress = (i - spikeIndex) / 6;
      const spikeFactor = 1 + spikeProgress * 1.3;
      rps *= spikeFactor;
      cpu = clamp(cpu * spikeFactor, 20, 99);
      mem = clamp(mem + spikeProgress * 12, 35, 97);
      p95 = clamp(p95 * (1.3 + spikeProgress * 0.8), 120, 900);
      err = clamp(err + spikeProgress * 4.5, 0, 35);
    }

    series.push({
      t,
      cpu: Math.round(cpu),
      mem: Math.round(mem),
      rps: Math.round(rps),
      err: parseFloat(err.toFixed(2)),
      p95: Math.round(p95),
    });
  }

  return { series };
}

export function generateObservabilityLogs(
  count = 40,
  series?: { series: ObservabilityPoint[] }
) {
  const logs: ObservabilityLog[] = [];
  const now = Date.now();

  const templates = {
    INFO: [
      "Health check passed",
      "Background task completed",
      "Autoscaler cycle finished",
      "Cache warmup finished",
      "Request handled",
    ],
    WARN: [
      "Slow query detected",
      "Latency elevated",
      "Cache miss spike",
      "Memory pressure rising",
      "Retrying upstream call",
    ],
    ERROR: [
      "Upstream timeout",
      "Database connection error",
      "Circuit breaker opened",
      "Failed to process request",
      "Job failed after retries",
    ],
  } as const;

  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    const level: ObservabilityLog["level"] =
      roll < 0.65 ? "INFO" : roll < 0.9 ? "WARN" : "ERROR";

    const msg = pick(templates[level]);
    const jitter = randBetween(-10 * 60 * 1000, 0);
    const ts = now + jitter;

    const baseContext: Record<string, unknown> = {
      route: Math.random() < 0.5 ? "/api/metrics" : "/api/chaos",
      region: Math.random() < 0.5 ? "iad1" : "cdg1",
    };

    if (series && series.series.length) {
      const last = series.series.at(-1)!;
      baseContext.cpu = last.cpu;
      baseContext.p95 = last.p95;
      baseContext.errRate = last.err;
    }

    logs.push({ level, msg, ts, context: baseContext });
  }

  return logs.sort((a, b) => b.ts - a.ts);
}

export function generateObservabilityAlerts(series: { series: ObservabilityPoint[] }) {
  const pts = series.series;
  const alerts: ObservabilityAlert[] = [];
  if (!pts.length) return alerts;

  const last = pts[pts.length - 1];
  const last3 = pts.slice(-3);

  if (last.p95 > 400) {
    alerts.push({
      id: "high-latency",
      severity: "high",
      title: "High Latency",
      description: "p95 latency is above 400ms. User experience may degrade.",
      value: last.p95,
      unit: "ms",
      rule: "p95_latency_ms > 400",
      active: true,
      startedAt: last.t,
    });
  }

  if (last.err > 5) {
    alerts.push({
      id: "error-spike",
      severity: "medium",
      title: "Elevated Error Rate",
      description: "Error rate is above 5%. Check upstream dependencies.",
      value: last.err,
      unit: "%",
      rule: "error_rate_percent > 5",
      active: true,
      startedAt: last.t,
    });
  }

  if (last3.length === 3 && last3.every((p) => p.cpu > 80)) {
    alerts.push({
      id: "cpu-hot",
      severity: "medium",
      title: "Sustained CPU Saturation",
      description: "CPU usage has been above 80% for 3 intervals.",
      value: last.cpu,
      unit: "%",
      rule: "cpu_percent > 80 for 3 points",
      active: true,
      startedAt: last3[0].t,
    });
  }

  alerts.push({
    id: "resolved-latency",
    severity: "low",
    title: "Resolved: Latency Spike",
    description: "Previous latency spike cooled down.",
    value: 220,
    unit: "ms",
    rule: "p95 back under 250ms",
    active: false,
    startedAt: Date.now() - 15 * 60 * 1000,
  });

  return alerts;
}
