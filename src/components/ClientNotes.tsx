"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import TagFilter from "@/components/TagFilter";
import type { PostMeta } from "@/types";
import PaginatedGrid from "@/components/PaginatedGrid";
import { usePersistentState } from "@/hooks/usePersistentState";

interface ClientNotesProps {
  notes: PostMeta[];
  allTags: string[];
}

export default function ClientNotes({
  notes,
  allTags,
}: ClientNotesProps) {
  const [activeTag, setActiveTag] = usePersistentState<string | null>(
    "notes-tag",
    null
  );

  const filtered = activeTag
    ? notes.filter((note) => note.tags?.includes(activeTag))
    : notes;

  useEffect(() => {
    const key = "notes-scroll";
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
        perPage={5}
        mode="infinite"
        renderItem={(note) => (
          <Link
            key={note.slug}
            href={`/notes/${note.slug}`}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-xl"
          >
            <article
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)]
                       p-5 shadow-sm group-hover:shadow-md group-hover:border-primary-400
                       transition-all duration-300"
            >
              <h3 className="text-h3 mb-1">{note.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{note.date}</p>
              <p className="text-base">{note.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {note.tags?.map((tag) => (
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
