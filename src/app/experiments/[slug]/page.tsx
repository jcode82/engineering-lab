import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleLayout from "@/components/ArticleLayout";
import { getExperiment } from "@/lib/server/mdx";
import type { PostMeta } from "@/types";

interface PageProps {
  params: { slug: string };
}

// Server component – no "use client"
export default function ExperimentPage({ params }: PageProps) {
  const { slug } = params;

  // Your loader returns { content, data }
  const { content, data } = getExperiment(slug);

  const meta: PostMeta = {
    type: "experiment",
    slug,
    title: (data as any).title ?? "Untitled experiment",
    date: (data as any).date ?? "",
    excerpt: (data as any).excerpt ?? "",
    tags: ((data as any).tags ?? []) as string[],
  };

  return (
    <ArticleLayout
      title={meta.title}
      date={meta.date}
      tags={meta.tags}
      kind="experiment"
    >
      <MDXRemote source={content} />
    </ArticleLayout>
  );
}

