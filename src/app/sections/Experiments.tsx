import SectionWrapper from "@/components/SectionWrapper";
import ClientExperiments from "@/components/ClientExperiments";
import Reveal from "@/components/Reveal";
import type { PostMeta } from "@/types";

import { getAllExperiments } from "@/lib/server/mdx";

export default function Experiments() {
  // Server-side MDX loading
  const experiments: PostMeta[] = getAllExperiments();

  // Collect tags
  const allTags = Array.from(
    new Set(experiments.flatMap((exp) => exp.tags ?? []))
  );

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

      {/* Data handed off to client-side filtering + pagination */}
      <ClientExperiments experiments={experiments} allTags={allTags} />
    </SectionWrapper>
  );
}
