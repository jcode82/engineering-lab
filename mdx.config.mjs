import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export default {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [[rehypePrettyCode, { theme: "github-dark" }]],
};
