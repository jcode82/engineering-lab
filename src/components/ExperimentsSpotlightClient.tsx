"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/types";

export default function ClientExperimentsSpotlight({
  experiments,
}: {
  experiments: PostMeta[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (experiments.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % experiments.length);
    }, 6000);
    return () => clearInterval(id);
  }, [experiments.length]);

  return (
    <section
      className="relative py-12"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(10,15,23,0.9), rgba(10,15,23,0.95)), url(/images/lab_desk_v2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" /> */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/80" />
      <div className="relative mx-auto max-w-6xl px-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Experiments Spotlight
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Fresh dispatches from the Engineering Lab, capturing the latest activity, prototype work, and real-world engineering lessons.
          </p>
        </div>

        <div className="relative mt-4 h-[420px]" style={{ perspective: "1400px", overflow: "hidden" }}>
          {experiments.map((experiment, i) => {
            const offset = i - index;
            const translateX = offset * 220;
            const rotateY = offset * -15;
            const scale = offset === 0 ? 1 : 0.9;
            const opacity = offset === 0 ? 1 : 0.45;

            return (
              <Link
                key={experiment.slug}
                href={`/experiments/${experiment.slug}`}
                className="absolute left-1/2 top-1/2 w-64 md:w-72 rounded-3xl border border-white/10 bg-black/60 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition-all duration-500 hover:border-cyan-300/70"
                style={{
                  transform: `translate3d(-50%, -50%, 0) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex: experiments.length - Math.abs(offset),
                }}
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                  {experiment.date}
                </span>
                <h3 className="mt-3 text-xl md:text-2xl font-semibold leading-tight text-white">
                  {experiment.title}
                </h3>
                <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
                  {experiment.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 text-[9px] uppercase tracking-wide">
                  {(experiment.tags ?? []).slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="border border-cyan-400/40 text-cyan-200 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-6 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25),transparent_70%)] blur-2xl opacity-80"
                />
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center gap-2">
          {experiments.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-cyan-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
