import { MDXRemote } from "next-mdx-remote/rsc";
import ArticleLayout from "@/components/ArticleLayout";
import { getExperiment } from "@/lib/server/mdx";
import { normalizeMeta } from "@/lib/normalizeMeta";
import { MDXComponents } from "@/components/mdx/MDXComponents";

interface PageProps {
  params: { slug: string };
}

// Server component – no "use client"
export default function ExperimentPage({ params }: PageProps) {
  const { slug } = params;

  // Your loader returns { content, data }
  const { content, data } = getExperiment(slug);
  const typedMeta = normalizeMeta(data, slug);

  return (
    <ArticleLayout
      title={typedMeta.title}
      date={typedMeta.date}
      tags={typedMeta.tags}
      kind="experiment"
    >
      <MDXRemote source={content} components={MDXComponents} />

      <MDXRemote source={content} />
    </ArticleLayout>
  );
}

