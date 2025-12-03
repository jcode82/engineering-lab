import ClientExperiments from "@/components/ClientExperiments";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import type { PostMeta } from "@/types";
import {
  experimentRowToMeta,
  getExperiments,
} from "@/lib/data/experiments";

export default async function ExperimentsPage() {
  const experimentRows = await getExperiments();
  const experiments: PostMeta[] = experimentRows.map(experimentRowToMeta);
  const allTags = Array.from(
    new Set(experiments.flatMap((exp) => exp.tags ?? []))
  );

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SectionWrapper id="experiments-page" noBorder>
        <Reveal>
          <h1 className="text-h2 heading-spacing text-center">
            Experiments
          </h1>
        </Reveal>
        <Reveal>
          <p className="text-base max-w-2xl mx-auto text-center">
            Live experiments pulled straight from Supabase metadata.
          </p>
        </Reveal>
        <ClientExperiments experiments={experiments} allTags={allTags} />
      </SectionWrapper>
    </main>
  );
}
