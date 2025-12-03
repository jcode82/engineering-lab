import SectionWrapper from "@/components/SectionWrapper";
import ClientNotes from "@/components/ClientNotes";
import Reveal from "@/components/Reveal";
import type { PostMeta } from "@/types";
import { getNotes, noteRowToMeta } from "@/lib/data/notes";

export default async function Notes() {
  const noteRows = await getNotes();
  const notes: PostMeta[] = noteRows.map(noteRowToMeta);

  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags ?? []))
  );

  return (
    <SectionWrapper id="notes">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Notes</h2>
      </Reveal>

      <ClientNotes notes={notes} allTags={allTags} />
    </SectionWrapper>
  );
}
