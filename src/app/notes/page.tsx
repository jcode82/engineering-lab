import ClientNotes from "@/components/ClientNotes";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import type { PostMeta } from "@/types";
import { getNotes, noteRowToMeta } from "@/lib/data/notes";

export default async function NotesPage() {
  const noteRows = await getNotes();
  const notes: PostMeta[] = noteRows.map(noteRowToMeta);
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags ?? []))
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SectionWrapper id="notes-page" noBorder>
        <Reveal>
          <h1 className="text-h2 heading-spacing text-center">Notes</h1>
        </Reveal>
        <Reveal>
          <p className="text-base max-w-2xl mx-auto text-center">
            Bite-sized lab dispatches, synced from Supabase metadata.
          </p>
        </Reveal>
        <ClientNotes notes={notes} allTags={allTags} />
      </SectionWrapper>
    </main>
  );
}
