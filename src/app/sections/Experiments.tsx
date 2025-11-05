"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";

export default function Experiments() {
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    fetch("/api/ping")
      .then(() => setLatency(Math.round(performance.now() - start)))
      .catch(() => setLatency(null));
  }, []);

  return (
    <SectionWrapper id="experiments" center>
      <h3 className="text-3xl md:text-4xl font-semibold mb-6">
        Latency Playground
      </h3>
      {latency !== null ? (
        <p>Round-trip latency: <strong>{latency} ms</strong></p>
      ) : (
        <p className="text-gray-500">Measuring…</p>
      )}
    </SectionWrapper>
  );
}
