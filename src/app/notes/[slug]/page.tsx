import { notFound } from "next/navigation";
import ArticleLayout from "@/components/ArticleLayout";
import {
  getBacklinks,
  getNote,
  getReferenceSummaries,
  getPrevNext,
  toLinkedSummary,
} from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { extractHeadings } from "@/lib/markdown/extractHeadings";
import { getNoteBySlug, getNotes, noteRowToMeta } from "@/lib/data/notes";

interface PageProps {
  params: { slug: string };
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = params;

  const metaRow = await getNoteBySlug(slug);
  if (!metaRow) {
    notFound();
  }

  const { content, data, source } = await getNote(slug);
  const typedMeta = normalizeMeta(
    {
      ...data,
      title: metaRow.title ?? (data.title as string | undefined),
      date: metaRow.date ?? (data.date as string | undefined),
      excerpt: metaRow.excerpt ?? (data.excerpt as string | undefined),
      tags: metaRow.tags ?? (data.tags as string[] | undefined),
    },
    slug,
    "note"
  );
  const headings = extractHeadings(source);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);
  const allNotes = (await getNotes()).map(noteRowToMeta);
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
      {content}
    </ArticleLayout>
  );
}
