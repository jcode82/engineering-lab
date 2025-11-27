"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/markdown/extractHeadings";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observers: IntersectionObserver[] = [];

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(heading.id);
            }
          });
        },
        {
          rootMargin: "-60% 0px -30% 0px",
          threshold: [0, 1],
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside
      className="hidden lg:block w-64 sticky top-28 self-start pr-6"
      aria-label="Table of contents"
    >
      <p className="text-xs uppercase tracking-[0.25em] text-primary-200">
        On this page
      </p>
      <nav className="mt-4 space-y-1 text-sm">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indent = heading.level === 3 ? "pl-6" : heading.level >= 4 ? "pl-8" : "";
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block rounded-lg px-3 py-2 transition ${indent} ${
                isActive
                  ? "bg-primary-500/10 text-primary-200"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "location" : undefined}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
