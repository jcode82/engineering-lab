"use client";
import React, { useState } from "react";
import TagFilter from "@/components/TagFilter";

export default function ClientNotes({
  notes,
  allTags,
}: {
  notes: any[];
  allTags: string[];
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? notes.filter((note: any) => note.tags?.includes(activeTag))
    : notes;

  return (
    <>
      <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />

      <div className="grid gap-6 mt-8">
        {filtered.map((note: any) => (
          <article
            key={note.slug}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)]
                       p-5 shadow-sm hover:shadow-md hover:border-primary-400
                       transition-all duration-300"
          >
            <h3 className="text-h3 mb-1">{note.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{note.date}</p>
            <p className="text-base">{note.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {note.tags?.map((tag: string) => (
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
