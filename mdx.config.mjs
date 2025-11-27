// mdx.config.mjs
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('unified').PluggableList} */
const remarkPlugins = [remarkGfm, remarkFrontmatter];

/** @type {import('unified').PluggableList} */
const rehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }],
  () =>
    rehypePrettyCode({
      theme: "github-dark",
    }),
];

const mdxOptions = {
  remarkPlugins,
  rehypePlugins,
};

export default mdxOptions;
