import type { PostMeta } from "@/types";

export function normalizeMeta(raw: any, slug: string): PostMeta {
  return {
    slug,
    title: raw.title ?? "Untitled",
    date: raw.date ?? "",
    excerpt: raw.excerpt ?? "",
    tags: raw.tags ?? [],
    type: raw.type ?? "experiment",
  };
}
