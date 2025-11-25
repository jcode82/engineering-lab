import ArticleLayout from "@/components/ArticleLayout";
import {
  getBacklinks,
  getExperiment,
  getReferenceSummaries,
  getAllExperiments,
  getPrevNext,
  toLinkedSummary,
} from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { extractHeadings } from "@/lib/markdown/extractHeadings";

interface PageProps {
  params: { slug: string };
}

// Server component – no "use client"
export default async function ExperimentPage({ params }: PageProps) {
  const { slug } = params;

  const { content, data, source } = await getExperiment(slug);
  const typedMeta = normalizeMeta(data, slug);
  const headings = extractHeadings(source);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allExperiments = getAllExperiments();
  const { prev, next } = getPrevNext(allExperiments, slug);
  const prevLink = prev ? toLinkedSummary(prev) : null;
  const nextLink = next ? toLinkedSummary(next) : null;

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      kind="experiment"
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
