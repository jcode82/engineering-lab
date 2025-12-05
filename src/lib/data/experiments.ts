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
    console.warn("[supabase] Failed to fetch experiments, falling back to MDX", error?.message);
    return fallbackExperiments();
  }

  return data;
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
