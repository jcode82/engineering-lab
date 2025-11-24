import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleLayout from "@/components/ArticleLayout";
import { getBacklinks, getNote, getReferenceSummaries } from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";

interface PageProps {
  params: { slug: string };
}

export default function NotePage({ params }: PageProps) {
  const { slug } = params;

  const { content, data } = getNote(slug);
  const typedMeta = normalizeMeta(data, slug);
  const referenceLinks = getReferenceSummaries(typedMeta.references ?? []);
  const backlinks = getBacklinks(slug);

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      kind="note"
      references={referenceLinks}
      backlinks={backlinks}
    >
      <MDXRemote source={content} />
    </ArticleLayout>
  );
}
