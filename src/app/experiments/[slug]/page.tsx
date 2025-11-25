import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote/rsc";
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
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { extractHeadings } from "@/lib/markdown/extractHeadings";
import mdxConfig from "../../../../mdx.config.mjs";

interface PageProps {
  params: { slug: string };
}

// Server component – no "use client"
export default function ExperimentPage({ params }: PageProps) {
  const { slug } = params;

  // Your loader returns { content, data }
  const { content, data } = getExperiment(slug);
  const typedMeta = normalizeMeta(data, slug);
  const headings = extractHeadings(content);
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
      <MDXRemote
        source={content}
        components={MDXComponents}
        options={{
          mdxOptions: mdxConfig as MDXRemoteOptions["mdxOptions"],
        }}
      />
    </ArticleLayout>
  );
}
