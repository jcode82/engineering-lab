// src/components/ArticleLayout.tsx
"use client";

import type { ReactNode } from "react";

interface ArticleLayoutProps {
  title: string;
  date?: string;
  tags?: string[];
  kind?: "experiment" | "note";
  children: ReactNode;
}

export default function ArticleLayout({
  title,
  date,
  tags = [],
  kind,
  children,
}: ArticleLayoutProps) {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* HEADER BLOCK */}
        <div
          className="mb-14 rounded-3xl border border-[var(--border)]/80 
                     bg-[var(--surface)]/80 dark:bg-black/40 
                     backdrop-blur-md p-6 md:p-8 
                     shadow-lg shadow-black/5
                     relative overflow-hidden"
        >
          {/* subtle gradient halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 
                       bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.18),_transparent_55%)]
                       opacity-70"
          />

          <div className="relative space-y-4">
            {kind && (
              <div
                className="inline-flex items-center gap-2 text-xs font-medium
                           px-3 py-1 rounded-full 
                           bg-primary-500/10 text-primary-400
                           border border-primary-500/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                <span className="uppercase tracking-[0.15em]">
                  {kind === "experiment" ? "LAB EXPERIMENT" : "LAB NOTE"}
                </span>
              </div>
            )}

            {/* TITLE */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold
                         bg-gradient-to-r from-primary-400 via-accent-400 to-highlight
                         bg-clip-text text-transparent
                         drop-shadow-[0_0_12px_rgba(15,23,42,0.25)]
                         leading-tight tracking-tight"
            >
              {title}
            </h1>

            {/* METADATA (DATE + TAGS) */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {date && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                  <span>{date}</span>
                </span>
              )}

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs
                                 bg-primary-500/8 text-primary-300
                                 border border-primary-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ARTICLE BODY (MDX) */}
        <article
          className="prose prose-slate dark:prose-invert max-w-none
                     prose-headings:scroll-mt-28
                     prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-bold
                     prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl md:prose-h2:text-3xl
                     prose-h3:mt-10 prose-h3:text-xl md:prose-h3:text-2xl
                     prose-p:leading-relaxed prose-p:my-4
                     prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline

                     /* Code blocks (rehype-pretty-code compatible) */
                     prose-pre:bg-slate-900/80 prose-pre:text-slate-100
                     prose-pre:rounded-xl prose-pre:p-4 prose-pre:border prose-pre:border-slate-800/60
                     prose-code:text-primary-300 prose-code:font-medium

                     /* Blockquotes */
                     prose-blockquote:border-l-primary-500/40
                     prose-blockquote:bg-primary-500/5
                     prose-blockquote:px-6 prose-blockquote:py-4

                     /* Tables */
                     prose-table:border-collapse
                     prose-th:bg-slate-100 dark:prose-th:bg-slate-800
                     prose-td:border prose-td:border-slate-300/40 dark:prose-td:border-slate-700/40
        "
        >
          {children}
        </article>
      </div>
    </main>
  );
}
