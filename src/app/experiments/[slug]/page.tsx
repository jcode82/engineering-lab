import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ArticleLayout";
import {
  experimentRowToMeta,
  getExperimentBySlug,
  getExperiments,
} from "@/lib/data/experiments";
import {
  getBacklinks,
  getExperiment,
  getReferenceSummaries,
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

  const metaRow = await getExperimentBySlug(slug);
  if (!metaRow) {
    notFound();
  }

  const { content, data, source } = await getExperiment(slug);
  const typedMeta = normalizeMeta(
    {
      ...data,
      title: metaRow.title ?? (data.title as string | undefined),
      date: metaRow.date ?? (data.date as string | undefined),
      excerpt: metaRow.excerpt ?? (data.excerpt as string | undefined),
      tags: metaRow.tags ?? (data.tags as string[] | undefined),
    },
    slug,
    "experiment"
  );
  const headings = extractHeadings(source);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allExperiments = (await getExperiments()).map(experimentRowToMeta);
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
