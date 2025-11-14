import { getExperiment } from "@/lib/server/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import SectionWrapper from "@/components/SectionWrapper";

interface PageProps {
  params: { slug: string };
}

export default function ExperimentPage({ params }: PageProps) {
  const { content, data } = getExperiment(params.slug);

  return (
    <SectionWrapper id={params.slug} center>
      <article className="prose dark:prose-invert max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-h1 mb-6">{data.title}</h1>
        <p className="text-sm text-muted-foreground mb-8">{data.date}</p>
        <MDXRemote source={content} />
      </article>
    </SectionWrapper>
  );
}
