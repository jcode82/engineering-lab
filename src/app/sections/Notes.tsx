import SectionWrapper from "@/components/SectionWrapper";
import ClientNotes from "@/components/ClientNotes";
import Reveal from "@/components/Reveal";
import type { PostMeta } from "@/types";

import { getAllNotes } from "@/lib/server/mdx";

export default function Notes() {
  // Server-side MDX loading
  const notes: PostMeta[] = getAllNotes();

  // Collect tags
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags ?? []))
  );

  return (
    <SectionWrapper id="notes">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Notes</h2>
      </Reveal>

      {/* Data handed off to client-side filtering + pagination */}
      <ClientNotes notes={notes} allTags={allTags} />
    </SectionWrapper>
  );
}
