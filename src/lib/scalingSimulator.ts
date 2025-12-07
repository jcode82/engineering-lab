export type Scenario = "thrashy" | "stable";

export interface ScalingPoint {
  t: number; // seconds since start
  load: number; // requests/sec
  replicas: number;
  cpu: number; // %
  memory: number; // %
}

const SIM_DURATION_SECONDS = 10 * 60; // 10 minutes
const STEP_SECONDS = 10;
const TARGET_RPS_PER_REPLICA = 120; // capacity

export function simulateScaling(scenario: Scenario): ScalingPoint[] {
  return scenario === "thrashy"
    ? simulateThrashyPolicy()
    : simulateStablePolicy();
}

// ----- Load shape (shared) -----

function loadAt(t: number): number {
  // synthetic pattern: ramp up, spike, dip, second wave
  const minutes = t / 60;

  // base: daytime traffic curve-ish
  let base =
    50 +
    200 * Math.sin((Math.PI * minutes) / 10) +
    40 * Math.sin((Math.PI * minutes) / 2.5);

  // spike around 4–5 minutes
  if (minutes > 4 && minutes < 5.5) base += 250;

  // floor
  return Math.max(20, base);
}

// ----- Autoscaler policies -----

function simulateThrashyPolicy(): ScalingPoint[] {
  const points: ScalingPoint[] = [];
  let replicas = 1;

  for (let t = 0; t <= SIM_DURATION_SECONDS; t += STEP_SECONDS) {
    const load = loadAt(t);

    // instantaneous desired replicas
    const desired = Math.max(1, Math.ceil(load / TARGET_RPS_PER_REPLICA));
    
    // thrashy: jump directly to desired
    replicas = desired;

    const cpu = Math.min(99, (load / (replicas * TARGET_RPS_PER_REPLICA)) * 100);
    const memory = clamp(40 + cpu * 0.3 + noise(5), 30, 95);

    points.push({
      t,
      load: Math.round(load),
      replicas,
      cpu: Math.round(cpu),
      memory: Math.round(memory),
    });
  }

  return points;
}

function simulateStablePolicy(): ScalingPoint[] {
  const points: ScalingPoint[] = [];
  let replicas = 1;
  let lastScaleTime = 0;
  const cooldown = 60; // 60s minimum between scale changes

  // simple error smoothing
  let smoothedUtil = 0.5;

  for (let t = 0; t <= SIM_DURATION_SECONDS; t += STEP_SECONDS) {
    const load = loadAt(t);
    const rawUtil = load / (replicas * TARGET_RPS_PER_REPLICA);
    smoothedUtil = 0.7 * smoothedUtil + 0.3 * rawUtil;
    const now = t;

    // scale up if sustained high utilization
    const needScaleUp = smoothedUtil > 0.75 && now - lastScaleTime > cooldown;

    // scale down if sustained low utilization
    const needScaleDown = smoothedUtil < 0.35 && now - lastScaleTime > cooldown;

    if (needScaleUp) {
      // conservative: only add 1–2 replicas
      const step = smoothedUtil > 1.0 ? 2 : 1;
      replicas += step;
      lastScaleTime = now;
    } else if (needScaleDown && replicas > 1) {
      replicas -= 1;
      lastScaleTime = now;
    }

    const cpu = Math.min(99, (load / (replicas * TARGET_RPS_PER_REPLICA)) * 100);
    const memory = clamp(40 + cpu * 0.25 + noise(4), 30, 90);

    points.push({
      t,
      load: Math.round(load),
      replicas,
      cpu: Math.round(cpu),
      memory: Math.round(memory),
    });
  }

  return points;
}

// ----- helpers -----

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function noise(magnitude: number) {
  return (Math.random() - 0.5) * 2 * magnitude;
}
