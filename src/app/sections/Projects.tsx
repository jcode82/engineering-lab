"use client";
import { useState, useEffect } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";

export default function Projects() {
      const [latency, setLatency] = useState<number | null>(null);
    
      useEffect(() => {
        const start = performance.now();
        fetch("/api/ping")
          .then(() => setLatency(Math.round(performance.now() - start)))
          .catch(() => setLatency(null));
      }, []);

  return (
    <SectionWrapper id="projects">
        <Reveal>
            <h2 className="text-h2 heading-spacing">Projects</h2>
        </Reveal>
        <Reveal>
            <p className="text-base max-w-2xl mx-auto">
                A collection of projects and experiments that showcases my work.
            </p>
        </Reveal>
        <Reveal>
            <article className="prose prose-slate lg:prose-lg mx-auto py-24">
                <h3 className="text-3xl md:text-4xl font-semibold mb-6">
                Latency Playground
                </h3>
                {latency !== null ? (
                <p>Round-trip latency: <strong>{latency} ms</strong></p>
                ) : (
                <p className="text-gray-500">Measuring…</p>
                )}
            </article>
        </Reveal>
    </SectionWrapper>
  );
}
