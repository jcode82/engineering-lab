import { getNote } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";

export default function NotePage({ params }: { params: { slug: string } }) {
  const { content, data } = getNote(params.slug);
  return (
    <main className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-h1 mb-6">{data.title}</h1>
      <MDXRemote source={content} />
    </main>
  );
}
