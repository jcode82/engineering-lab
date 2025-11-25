import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkFrontmatter],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypePrettyCode,
      {
        theme: "github-dark",
      },
    ],
  ],
};

export default mdxOptions;
