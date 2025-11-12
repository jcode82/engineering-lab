"use client";
import React, { useState } from "react";
import TagFilter from "@/components/TagFilter";

export default function ClientExperiments({
  experiments,
  allTags,
}: {
  experiments: any[];
  allTags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? experiments.filter((exp: any) => exp.tags?.includes(activeTag))
    : experiments;

  return (
    <>
      <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />

      <div className="grid gap-8 mt-8">
        {filtered.map((exp: any) => (
          <article
            key={exp.slug}
            className="border border-[var(--border)] rounded-lg p-6
                       hover:border-primary-400 transition-colors"
          >
            <h3 className="text-h3 mb-1">{exp.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{exp.date}</p>
            <p className="text-base">{exp.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {exp.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
