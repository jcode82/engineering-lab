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
    <section className="relative my-20 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_70%)] blur-3xl"
      />
      <div className="relative mx-auto max-w-5xl px-4">
        <h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight mb-2">
          Experiments Spotlight
        </h2>
        <p className="text-center text-sm text-[var(--muted)] mb-8">
          Fresh experiments from the Engineering Lab
        </p>

        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)]/80 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/30">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {experiments.map((experiment) => (
              <CarouselSlide key={experiment.slug} experiment={experiment} />
            ))}
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {experiments.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-cyan-400" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselSlide({ experiment }: { experiment: PostMeta }) {
  return (
    <Link
      href={`/experiments/${experiment.slug}`}
      className="min-w-full p-10 text-center flex flex-col items-center gap-4"
    >
      <span className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
        {experiment.date}
      </span>
      <h3 className="text-2xl font-semibold">{experiment.title}</h3>
      <p className="text-sm text-[var(--muted)] max-w-md">
        {experiment.excerpt}
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-wide">
        {(experiment.tags ?? []).slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="border border-cyan-400/40 text-cyan-200 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
