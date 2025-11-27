import type { PostKind, PostMeta } from "@/types";

interface RawFrontmatter {
  title?: string;
  date?: string;
  excerpt?: string;
  summary?: string;
  tags?: string[];
  type?: PostKind;
  references?: string[];
  status?: string;
}
export function normalizeMeta(
  raw: RawFrontmatter,
  slug: string,
  fallbackType: PostKind = "experiment"
): PostMeta {
  return {
    slug,
    title: raw.title ?? "Untitled",
    date: raw.date ?? "",
    excerpt: raw.excerpt ?? raw.summary ?? "",
    tags: raw.tags ?? [],
    type: raw.type ?? fallbackType,
    references: raw.references ?? [],
    status: raw.status,
  };
}
