import React from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { getAllNotes } from "@/lib/mdx";
import ClientNotes from "@/components/ClientNotes";
import type { PostMeta } from "@/types";
import Reveal from "@/components/Reveal";

export default async function Notes() {
  const notes: PostMeta[] = getAllNotes();

  // Collect all tags
  const allTags = Array.from(
    new Set(notes.flatMap((note) => note.tags ?? []))
  );

  // Tag filtering UI must be client-side
  return (
    <SectionWrapper id="notes">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Notes</h2>
      </Reveal>
      {/* Hand off data to a client-side component */}
      <ClientNotes notes={notes} allTags={allTags} />
    </SectionWrapper>
  );
}