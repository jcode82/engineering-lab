import { createAdminClient } from "./supabase/admin";
import { getAllExperiments, getAllNotes } from "./server/mdx";

export async function syncAllMetadata() {
  const supabase = createAdminClient();

  const experiments = getAllExperiments();
  const notes = getAllNotes();

  // Sync experiments
  for (const exp of experiments) {
    const { error } = await supabase
      .from("experiments")
      .upsert(
        {
          slug: exp.slug,
          title: exp.title,
          excerpt: exp.excerpt,
          date: exp.date,
          tags: exp.tags ?? [],
        },
        { onConflict: "slug" }
      );

    if (error) console.error("[SYNC ERROR: EXPERIMENT]", error);
  }

  // Sync notes
  for (const note of notes) {
    const { error } = await supabase
      .from("notes")
      .upsert(
        {
          slug: note.slug,
          title: note.title,
          excerpt: note.excerpt,
          date: note.date,
          tags: note.tags ?? [],
        },
        { onConflict: "slug" }
      );

    if (error) console.error("[SYNC ERROR: NOTE]", error);
  }

  return {
    experimentsSynced: experiments.length,
    notesSynced: notes.length,
  };
}
