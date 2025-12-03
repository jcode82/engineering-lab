import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";

export type NoteRow = Database["public"]["Tables"]["notes"]["Row"];

export function noteRowToMeta(row: NoteRow): PostMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date ?? "",
    excerpt: row.excerpt ?? "",
    tags: row.tags ?? [],
    type: "note",
  };
}

export async function getNotes(): Promise<NoteRow[]> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }

  return data ?? [];
}

export async function getNoteBySlug(slug: string): Promise<NoteRow | null> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch note: ${error.message}`);
  }

  return data ?? null;
}
