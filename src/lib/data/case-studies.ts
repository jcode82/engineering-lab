import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";

export type CaseStudyRow =
  Database["public"]["Tables"]["case_studies"]["Row"];

export function caseStudyRowToMeta(row: CaseStudyRow): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date ?? "",
    excerpt: row.excerpt ?? "",
    tags: row.tags ?? [],
    type: "case-study",
    status: row.status ?? undefined,
  };
}

export async function getCaseStudies(): Promise<CaseStudyRow[]> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch case studies: ${error.message}`);
  }

  return data ?? [];
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudyRow | null> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch case study: ${error.message}`);
  }

  return data ?? null;
}
