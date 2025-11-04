"use client";
import { useState, useEffect } from "react";

export default function Experiments() {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    fetch("/api/ping")
      .then(() => setLatency(Math.round(performance.now() - start)))
      .catch(() => setLatency(null));
  }, []);

  return (
    <section id="experiments" className="py-20 text-center">
      <h3 className="text-2xl font-semibold mb-4">Latency Playground</h3>
      {latency !== null ? (
        <p>Round-trip latency: <strong>{latency} ms</strong></p>
      ) : (
        <p className="text-gray-500">Measuring...</p>
      )}
    </section>
  );
}
