import type { PostMeta } from "@/types";

interface RawFrontmatter {
  title?: string;
  date?: string;
  excerpt?: string;
  tags?: string[];
  type?: "experiment" | "note";
  references?: string[];
}
export function normalizeMeta(raw: RawFrontmatter, slug: string): PostMeta {
  return {
    slug,
    title: raw.title ?? "Untitled",
    date: raw.date ?? "",
    excerpt: raw.excerpt ?? "",
    tags: raw.tags ?? [],
    type: raw.type ?? "experiment",
    references: raw.references ?? [],
  };
}
