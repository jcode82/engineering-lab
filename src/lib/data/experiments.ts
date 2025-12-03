import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";

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

  if (error) {
    throw new Error(`Failed to fetch experiments: ${error.message}`);
  }

  return data ?? [];
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

  if (error) {
    throw new Error(`Failed to fetch experiment: ${error.message}`);
  }

  return data ?? null;
}
