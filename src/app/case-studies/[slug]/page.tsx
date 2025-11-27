import ArticleLayout from "@/components/ArticleLayout";
import {
  getBacklinks,
  getCaseStudy,
  getReferenceSummaries,
  getAllCaseStudies,
  getPrevNext,
  toLinkedSummary,
} from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { extractHeadings } from "@/lib/markdown/extractHeadings";

interface PageProps {
  params: { slug: string };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = params;

  const { content, data, source } = await getCaseStudy(slug);
  const typedMeta = normalizeMeta(data, slug, "case-study");
  const headings = extractHeadings(source);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allCaseStudies = getAllCaseStudies();
  const { prev, next } = getPrevNext(allCaseStudies, slug);
  const prevLink = prev ? toLinkedSummary(prev) : null;
  const nextLink = next ? toLinkedSummary(next) : null;

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      kind="case-study"
      headings={headings}
      references={referenceLinks}
      backlinks={backlinks}
      prev={prevLink}
      next={nextLink}
    >
      {content}
    </ArticleLayout>
  );
}
