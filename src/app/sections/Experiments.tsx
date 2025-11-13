import React from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { getAllExperiments } from "@/lib/mdx";;
import ClientExperiments from "@/components/ClientExperiments";
import type { PostMeta } from "@/types";
import Reveal from "@/components/Reveal";

export default async function Experiments() {
  const experiments: PostMeta[] = getAllExperiments();

  // Collect all tags
  const allTags = Array.from(
    new Set(experiments.flatMap((exp) => exp.tags ?? []))
  );

  // Tag filtering UI must be client-side
  return (
    <SectionWrapper id="projects">
      <Reveal
        variants={{
          hidden: { opacity: 0, y: 20, rotateX: 15 },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.7, ease: "easeOut" },
          },
        }}
      >
        <h2 className="text-h2 heading-spacing">Experiments</h2>
      </Reveal>
      {/* Hand off data to a client-side component */}
      <ClientExperiments experiments={experiments} allTags={allTags} />
    </SectionWrapper>
  );
}

