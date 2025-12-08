import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";
import { getAllExperiments } from "@/lib/server/mdx";

export type ExperimentRow =
  Database["public"]["Tables"]["experiments"]["Row"];

export function experimentRowToMeta(row: ExperimentRow): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date ?? "",
    excerpt: row.excerpt ?? "",
    tags: row.tags ?? [],
    type: "experiment",
  };
}

export async function getExperiments(): Promise<ExperimentRow[]> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("experiments")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn(
      "[supabase] Failed to fetch experiments, falling back to MDX",
      error?.message
    );
    return fallbackExperiments();
  }

  const merged = mergeWithMdx(data);
  return sortByDateDesc(merged);
}

export async function getExperimentBySlug(
  slug: string
): Promise<ExperimentRow | null> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("experiments")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const fallbackMeta = getAllExperiments().find((meta) => meta.slug === slug);
    return fallbackMeta ? metaToExperimentRow(fallbackMeta) : null;
  }

  return data;
}

function metaToExperimentRow(meta: PostMeta): ExperimentRow {
  return {
    id: meta.slug,
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    date: meta.date,
    tags: meta.tags ?? [],
    created_at: null,
    updated_at: null,
  };
}

function fallbackExperiments(): ExperimentRow[] {
  return getAllExperiments().map(metaToExperimentRow);
}

function mergeWithMdx(rows: ExperimentRow[]): ExperimentRow[] {
  const existing = new Map(rows.map((row) => [row.slug, row] as const));
  const mdxMetas = getAllExperiments();

  for (const meta of mdxMetas) {
    if (!existing.has(meta.slug)) {
      existing.set(meta.slug, metaToExperimentRow(meta));
    }
  }

  return Array.from(existing.values());
}

function sortByDateDesc(rows: ExperimentRow[]): ExperimentRow[] {
  return rows.sort((a, b) => {
    const dayA = Date.parse(a.date ?? "");
    const dayB = Date.parse(b.date ?? "");
    return (isNaN(dayB) ? 0 : dayB) - (isNaN(dayA) ? 0 : dayA);
  });
}
