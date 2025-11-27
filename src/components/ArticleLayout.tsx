// src/components/ArticleLayout.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LinkedPostSummary, PostKind } from "@/types";
import type { Heading } from "@/lib/markdown/extractHeadings";
import TableOfContents from "@/components/TableOfContents";

const KIND_LABELS: Record<PostKind, string> = {
  experiment: "LAB EXPERIMENT",
  note: "LAB NOTE",
  "case-study": "CASE STUDY",
};

const TYPE_LABELS: Record<PostKind, string> = {
  experiment: "Lab Experiment",
  note: "Lab Note",
  "case-study": "Case Study",
};

interface ArticleLayoutProps {
  title: string;
  date?: string;
  tags?: string[];
  kind?: PostKind;
  children: ReactNode;
  references?: LinkedPostSummary[];
  backlinks?: LinkedPostSummary[];
  headings?: Heading[];
  prev?: LinkedPostSummary | null;
  next?: LinkedPostSummary | null;
}

export default function ArticleLayout({
  title,
  date,
  tags = [],
  kind,
  references = [],
  backlinks = [],
  children,
  headings = [],
  prev = null,
  next = null,
}: ArticleLayoutProps) {
  const hasReferences = references.length > 0;
  const hasBacklinks = backlinks.length > 0;
  const hasSidebar = headings.length > 0;
  const hasNav = Boolean(prev || next);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,_720px)_260px] lg:justify-center">
          <div>
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
                        {KIND_LABELS[kind]}
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
              data-article-root="true"
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

            {(hasReferences || hasBacklinks) && (
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {hasReferences && (
                  <div
                    className="rounded-3xl border border-[var(--border)]/80 bg-[var(--surface)]/60
                               p-6 shadow-lg shadow-black/5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-200">
                      References
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Entries this piece links out to.
                    </p>
                    <ul className="mt-4 space-y-3 text-sm">
                      {references.map((ref) => (
                        <li key={ref.slug}>
                          <Link
                            href={ref.href}
                            className="group flex flex-col rounded-xl border border-transparent
                                       px-3 py-2 transition hover:border-primary-500/40
                                       hover:bg-primary-500/5"
                          >
                            <span className="text-foreground font-medium group-hover:text-primary-300">
                              {ref.title}
                            </span>
                            <span className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                              {TYPE_LABELS[ref.type]}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasBacklinks && (
                  <div
                    className="rounded-3xl border border-[var(--border)]/80 bg-[var(--surface)]/60
                               p-6 shadow-lg shadow-black/5"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-primary-200">
                      Referenced By
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Other lab entries that mention this work.
                    </p>
                    <ul className="mt-4 space-y-3 text-sm">
                      {backlinks.map((ref) => (
                        <li key={ref.slug}>
                          <Link
                            href={ref.href}
                            className="group flex flex-col rounded-xl border border-transparent
                                       px-3 py-2 transition hover:border-primary-500/40
                                       hover:bg-primary-500/5"
                          >
                            <span className="text-foreground font-medium group-hover:text-primary-300">
                              {ref.title}
                            </span>
                            <span className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                              {TYPE_LABELS[ref.type]}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {hasNav && (
              <div
                className="mt-16 pt-8 border-t border-[var(--border)]/70
                           flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
              >
                {prev ? (
                  <Link
                    href={prev.href}
                    className="group rounded-2xl border border-transparent
                               px-4 py-3 transition hover:border-primary-500/40
                               hover:bg-primary-500/5"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-200">
                      Previous{" "}
                      <span aria-hidden className="text-primary-300">
                        ←
                      </span>
                    </p>
                    <p className="text-base font-semibold text-foreground group-hover:text-primary-200">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    href={next.href}
                    className="group text-right rounded-2xl border border-transparent
                               px-4 py-3 transition hover:border-primary-500/40
                               hover:bg-primary-500/5"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-200">
                      Next{" "}
                      <span aria-hidden className="text-primary-300">
                        →
                      </span>
                    </p>
                    <p className="text-base font-semibold text-foreground group-hover:text-primary-200">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>

          {hasSidebar && <TableOfContents headings={headings} />}
        </div>
      </div>
    </main>
  );
}
