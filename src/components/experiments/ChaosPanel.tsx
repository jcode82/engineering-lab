"use client";

import { useState } from "react";

export default function ChaosPanel() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function triggerChaos() {
    setLog([]);
    setLoading(true);

    let attempts = 0;

    while (attempts < 3) {
      attempts += 1;
      setLog((prev) => [...prev, `Attempt ${attempts}: sending request...`]);

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 2500);
        const res = await fetch("/api/chaos", { signal: controller.signal });
        clearTimeout(timer);

        let line = `Attempt ${attempts}: status ${res.status}`;
        try {
          const data = await res.json();
          line += ` → "${data.message}"`;
        } catch {
          line += " → (no JSON)";
        }

        setLog((prev) => [...prev, line]);

        if (res.ok) {
          setLog((prev) => [...prev, "✅ System recovered"]);
          setLoading(false);
          return;
        }
      } catch {
        setLog((prev) => [...prev, `Attempt ${attempts}: timeout/abort`]);
      }
    }

    setLog((prev) => [...prev, "❌ Chaos wins! Max retries reached."]);
    setLoading(false);
  }

  return (
    <div
      className="mt-6 p-6 rounded-2xl border border-[var(--border)]/60
                 bg-[var(--surface)]/70 dark:bg-black/40 backdrop-blur-md
                 shadow-lg shadow-black/5 transition-all"
    >
      <button
        onClick={triggerChaos}
        disabled={loading}
        className="mt-2 px-5 py-2 rounded-lg border border-[var(--border)]/50
                   hover:border-primary-400/60 transition disabled:opacity-50"
      >
        {loading ? "Running..." : "Trigger Chaos"}
      </button>

      <div className="mt-4 text-sm space-y-1">
        {log.map((line, idx) => (
          <p key={idx} className="opacity-80">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
