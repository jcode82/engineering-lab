import { createSupabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase.types";
import type { PostMeta } from "@/types";
import { getAllNotes } from "@/lib/server/mdx";

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

  if (error || !data) {
    console.warn("[supabase] Failed to fetch notes, falling back to MDX", error?.message);
    return fallbackNotes();
  }

  return data;
}

export async function getNoteBySlug(slug: string): Promise<NoteRow | null> {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const fallbackMeta = getAllNotes().find((meta) => meta.slug === slug);
    return fallbackMeta ? metaToNoteRow(fallbackMeta) : null;
  }

  return data;
}

function metaToNoteRow(meta: PostMeta): NoteRow {
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

function fallbackNotes(): NoteRow[] {
  return getAllNotes().map(metaToNoteRow);
}
