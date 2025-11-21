import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    [rehypePrettyCode, { theme: "github-dark" }],
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "append",
        properties: {
          className: ["anchor-link"],
        },
      },
    ],
  ],
};
