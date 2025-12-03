import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ArticleLayout";
import CaseStudyDetail from "@/components/case-studies/CaseStudyDetail";
import {
  getBacklinks,
  getCaseStudy as getCaseStudyContent,
  getReferenceSummaries,
  getPrevNext,
  toLinkedSummary,
} from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { extractHeadings } from "@/lib/markdown/extractHeadings";
import {
  caseStudyRowToMeta,
  getCaseStudies,
  getCaseStudyBySlug,
} from "@/lib/data/case-studies";

interface PageProps {
  params: { slug: string };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = params;

  const metaRow = await getCaseStudyBySlug(slug);
  if (!metaRow) {
    notFound();
  }

  const { content, data, source } = await getCaseStudyContent(slug);
  const typedMeta = normalizeMeta(
    {
      ...data,
      title: metaRow.title ?? (data.title as string | undefined),
      date: metaRow.date ?? (data.date as string | undefined),
      excerpt: metaRow.excerpt ?? (data.excerpt as string | undefined),
      tags: metaRow.tags ?? (data.tags as string[] | undefined),
      status: metaRow.status ?? (data.status as string | undefined),
    },
    slug,
    "case-study"
  );
  const headings = extractHeadings(source);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allCaseStudies = (await getCaseStudies()).map(caseStudyRowToMeta);
  const { prev, next } = getPrevNext(allCaseStudies, slug);
  const prevLink = prev ? toLinkedSummary(prev) : null;
  const nextLink = next ? toLinkedSummary(next) : null;

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      status={typedMeta.status}
      kind="case-study"
      headings={headings}
      references={referenceLinks}
      backlinks={backlinks}
      prev={prevLink}
      next={nextLink}
    >
      <CaseStudyDetail
        title={typedMeta.title}
        date={typedMeta.date}
        tags={typedMeta.tags}
        status={typedMeta.status}
        excerpt={typedMeta.excerpt}
      />
      {content}
    </ArticleLayout>
  );
}
