"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import TagFilter from "@/components/TagFilter";
import type { PostMeta } from "@/types";
import PaginatedGrid from "@/components/PaginatedGrid";
import { usePersistentState } from "@/hooks/usePersistentState";

interface ClientExperimentsProps {
  experiments: PostMeta[];
  allTags: string[];
}

export default function ClientExperiments({
  experiments,
  allTags,
}: ClientExperimentsProps) {
  const [activeTag, setActiveTag] = usePersistentState<string | null>(
    "experiments-tag",
    null
  );

  const filtered = activeTag
    ? experiments.filter((exp) => exp.tags?.includes(activeTag))
    : experiments;

  // Remember scroll position per session
  useEffect(() => {
    const key = "experiments-scroll";
    const saved = window.sessionStorage.getItem(key);
    if (saved) window.scrollTo(0, parseFloat(saved));

    const handleScroll = () =>
      window.sessionStorage.setItem(key, window.scrollY.toString());

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
      <PaginatedGrid
        items={filtered}
        perPage={6}
        renderItem={(exp) => (
          <Link
            key={exp.slug}
            href={`/experiments/${exp.slug}`}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-lg"
          >
            <article
              className="border border-[var(--border)] rounded-lg p-6 group-hover:border-primary-400 transition-colors"
            >
              <h3 className="text-h3 mb-1">{exp.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{exp.date}</p>
              <p className="text-base">{exp.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Link>
        )}
      />
    </>
  );
}
