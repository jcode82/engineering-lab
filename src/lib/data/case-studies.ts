import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";
import { getAllCaseStudies } from "@/lib/server/mdx";

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

  if (error || !data) {
    console.warn(
      "[supabase] Failed to fetch case studies, falling back to MDX",
      error?.message
    );
    return fallbackCaseStudies();
  }

  return data;
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

  if (error || !data) {
    const fallbackMeta = getAllCaseStudies().find((meta) => meta.slug === slug);
    return fallbackMeta ? metaToCaseRow(fallbackMeta) : null;
  }

  return data;
}

function metaToCaseRow(meta: PostMeta): CaseStudyRow {
  return {
    id: meta.slug,
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    date: meta.date,
    tags: meta.tags ?? [],
    status: meta.status ?? null,
    created_at: null,
    updated_at: null,
  };
}

function fallbackCaseStudies(): CaseStudyRow[] {
  return getAllCaseStudies().map(metaToCaseRow);
}
