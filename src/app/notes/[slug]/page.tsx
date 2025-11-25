import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleLayout from "@/components/ArticleLayout";
import {
  getBacklinks,
  getNote,
  getReferenceSummaries,
  getAllNotes,
  getPrevNext,
  toLinkedSummary,
} from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { extractHeadings } from "@/lib/markdown/extractHeadings";
import mdxConfig from "../../../../mdx.config.mjs";

interface PageProps {
  params: { slug: string };
}

export default function NotePage({ params }: PageProps) {
  const { slug } = params;

  const { content, data } = getNote(slug);
  const typedMeta = normalizeMeta(data, slug);
  const headings = extractHeadings(content);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allNotes = getAllNotes();
  const { prev, next } = getPrevNext(allNotes, slug);
  const prevLink = prev ? toLinkedSummary(prev) : null;
  const nextLink = next ? toLinkedSummary(next) : null;

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      kind="note"
      headings={headings}
      references={referenceLinks}
      backlinks={backlinks}
      prev={prevLink}
      next={nextLink}
    >
      <MDXRemote
        source={content}
        options={{
          mdxOptions: mdxConfig as any,
        }}
      />
    </ArticleLayout>
  );
}
