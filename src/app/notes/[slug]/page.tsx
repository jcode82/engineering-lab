import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleLayout from "@/components/ArticleLayout";
import { getNote } from "@/lib/server/mdx";
import type { PostMeta } from "@/types";

interface PageProps {
  params: { slug: string };
}

export default function NotePage({ params }: PageProps) {
  const { slug } = params;

  const { content, data } = getNote(slug);

  const meta: PostMeta = {
    type: "note",
    slug,
    title: (data as any).title ?? "Untitled note",
    date: (data as any).date ?? "",
    excerpt: (data as any).excerpt ?? "",
    tags: ((data as any).tags ?? []) as string[],
  };

  return (
    <ArticleLayout
      title={meta.title}
      date={meta.date}
      tags={meta.tags}
      kind="note"
    >
      <MDXRemote source={content} />
    </ArticleLayout>
  );
}
