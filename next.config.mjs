import createMDX from "@next/mdx";
import mdxConfig from "./mdx.config.mjs";

/** 
 * Merge Next + MDX Config cleanly
 * This is the official Next.js recommended pattern.
 */
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: mdxConfig,   // <-- IMPORTANT
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Add MDX into page extension resolution
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  experimental: {
    mdxRs: true, // enable Rust MDX compiler
  },
};

export default withMDX(nextConfig);
