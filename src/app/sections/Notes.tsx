// import SectionWrapper from "@/components/SectionWrapper";

// export default function Notes() {
//   return (
//     <SectionWrapper id="notes">
//       <h2 className="text-h2 heading-spacing">Notes</h2>
//       <p className="text-base max-w-2xl mx-auto">
//         A space for thoughts, essays, or experiments.
//       </p>
//       <article className="prose prose-slate lg:prose-lg mx-auto py-24">
//         <h1 className="text-3xl md:text-4xl font-semibold mb-6">The Science of Latency</h1>
//         <p>
//           Latency is the hidden heartbeat of every networked system.
//           Measuring it, visualizing it, and learning from it defines the rhythm of performance engineering. 
//         </p>
//         <h2 className="text-3xl md:text-3xl font-semibold mb-6">Why It Matters</h2>
//         <ul>
//           <li>Latency drives perceived speed</li>
//           <li>It reveals bottlenecks in distributed systems</li>
//           <li>It helps predict scalability limits</li>
//         </ul>
//       </article>
//     </SectionWrapper>
//   );
// }


// import SectionWrapper from "@/components/SectionWrapper";
// import { getAllNotes, type NotesMeta } from "@/lib/mdx";

// export default function Notes() {
//   const notes: NotesMeta[] = getAllNotes();

//   return (
//     <SectionWrapper id="notes">
//       <h2 className="text-h2 heading-spacing">Notes</h2>
//       <div className="grid gap-6 mt-8">
//         {notes.map((note) => (
//           <article
//             key={note.slug}
//             className="rounded-xl border border-[var(--border)] bg-[var(--surface)]
//                        p-5 shadow-sm hover:shadow-md hover:border-primary-400
//                        transition-all duration-300"
//           >
//             <h3 className="text-h3 mb-1">{note.title}</h3>
//             <p className="text-sm text-muted-foreground mb-3">{note.date}</p>
//             <p className="text-base">{note.excerpt}</p>
//           </article>
//         ))}
//       </div>
//     </SectionWrapper>
//   );
// }

import React from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { getAllNotes, type NotesMeta } from "@/lib/mdx";
import ClientNotes from "@/components/ClientNotes";

export default async function Notes() {
  const notes: NotesMeta[] = getAllNotes();

  // Collect all tags
  const allTags = Array.from(
    new Set(notes.flatMap((note: any) => note.tags || []))
  );

  // Tag filtering UI must be client-side
  return (
    <SectionWrapper id="projects">
      <h2 className="text-h2 heading-spacing">Notes</h2>
      {/* Hand off data to a client-side component */}
      <ClientNotes notes={notes} allTags={allTags} />
    </SectionWrapper>
  );
}