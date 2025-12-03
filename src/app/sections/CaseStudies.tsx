import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import { caseStudyRowToMeta, getCaseStudies } from "@/lib/data/case-studies";

export default async function CaseStudiesSection() {
  const rows = await getCaseStudies();
  const caseStudies = rows.map(caseStudyRowToMeta).slice(0, 4);

  return (
    <SectionWrapper id="case-studies">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Case Studies</h2>
      </Reveal>
      <Reveal>
        <p className="text-base max-w-2xl mx-auto">
          Deep dives into outages, migrations, and system rebuilds that shaped
          the lab&apos;s playbook.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {caseStudies.length > 0 ? (
          caseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.slug}
              slug={cs.slug}
              title={cs.title}
              excerpt={cs.excerpt}
              date={cs.date}
              tags={cs.tags}
              status={cs.status}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            No case studies published yet. Check back soon.
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}
