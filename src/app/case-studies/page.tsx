import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import { caseStudyRowToMeta, getCaseStudies } from "@/lib/data/case-studies";

export default async function CaseStudiesPage() {
  const rows = await getCaseStudies();
  const caseStudies = rows.map(caseStudyRowToMeta);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SectionWrapper id="case-studies" noBorder>
        <Reveal>
          <h1 className="text-h2 heading-spacing text-center">
            Case Studies
          </h1>
        </Reveal>
        <Reveal>
          <p className="text-base max-w-2xl mx-auto text-center">
            Field reports on incidents, migrations, and lessons learned
            straight from the Engineering Lab.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.slug}
              slug={cs.slug}
              title={cs.title}
              excerpt={cs.excerpt}
              date={cs.date}
              tags={cs.tags}
              status={cs.status}
            />
          ))}
        </div>
      </SectionWrapper>
    </main>
  );
}
