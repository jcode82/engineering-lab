import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { LinkedPostSummary, PostKind, PostMeta } from "@/types";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import mdxConfig from "../../../mdx.config.mjs";

// Enforce server-only execution
export const runtime = "nodejs"; // Next.js hint
export const dynamic = "force-static";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src/content");
type CollectionDir = "experiments" | "notes" | "case-studies";
const COLLECTIONS: CollectionDir[] = ["experiments", "notes", "case-studies"];

const DIR_TO_TYPE: Record<CollectionDir, PostMeta["type"]> = {
  experiments: "experiment",
  notes: "note",
  "case-studies": "case-study",
};

const DIR_TO_PATH: Record<CollectionDir, string> = {
  experiments: "/experiments",
  notes: "/notes",
  "case-studies": "/case-studies",
};

const TYPE_TO_DIR: Record<PostKind, CollectionDir> = {
  experiment: "experiments",
  note: "notes",
  "case-study": "case-studies",
};

function getDateValue(date: string | undefined) {
  const parsed = Date.parse(date ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

// Generic loader for any directory (experiments, notes, etc.)
function loadCollection(dir: CollectionDir): PostMeta[] {
  const folder = path.join(CONTENT_ROOT, dir);

  if (!fs.existsSync(folder)) {
    console.warn(`[mdx] Missing content directory: ${folder}`);
    return [];
  }

  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".mdx"));

  const items = files.map((file) => {
    const fullPath = path.join(folder, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    const slug = file.replace(/\.mdx?$/, "");
    const excerpt = data.excerpt ?? data.summary ?? "";
    return {
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt,
      tags: data.tags || [],
      type: DIR_TO_TYPE[dir],
      references: data.references || [],
      status: data.status,
    } satisfies PostMeta;
  });

  return items.sort((a, b) => getDateValue(b.date) - getDateValue(a.date));
}

function loadRawEntry(dir: string, slug: string) {
  const fullPath = path.join(CONTENT_ROOT, dir, `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}

async function compileEntry(dir: CollectionDir, slug: string) {
  const source = loadRawEntry(dir, slug);
  const { content, frontmatter } = await compileMDX({
    source,
    components: MDXComponents,
    options: {
      mdxOptions: {
        remarkPlugins: mdxConfig.remarkPlugins,
        rehypePlugins: mdxConfig.rehypePlugins,
      },
      parseFrontmatter: true,
    },
  });


  return { content, data: frontmatter, source };
}

// --- PUBLIC APIS ---

// Experiments
export const getAllExperiments = () => loadCollection("experiments");
export const getExperiment = (slug: string) =>
  compileEntry("experiments", slug);

// Notes
export const getAllNotes = () => loadCollection("notes");
export const getNote = (slug: string) => compileEntry("notes", slug);

// Case studies
export const getAllCaseStudies = () => loadCollection("case-studies");
export const getCaseStudy = (slug: string) =>
  compileEntry("case-studies", slug);

export function getPrevNext(
  allPosts: PostMeta[],
  slug: string
): { prev: PostMeta | null; next: PostMeta | null } {
  if (!allPosts.length) return { prev: null, next: null };
  const index = allPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: allPosts[index + 1] ?? null,
    next: allPosts[index - 1] ?? null,
  };
}

// Shared helpers
function mapToLinkedPost(meta: PostMeta, dir: CollectionDir): LinkedPostSummary {
  return {
    slug: meta.slug,
    title: meta.title,
    type: meta.type,
    href: `${DIR_TO_PATH[dir]}/${meta.slug}`,
  };
}

function loadAllMeta(): Array<{ meta: PostMeta; dir: CollectionDir }> {
  return COLLECTIONS.flatMap((dir) =>
    loadCollection(dir).map((meta) => ({ meta, dir }))
  );
}

export function getReferenceSummaries(
  slugs: string[] = []
): LinkedPostSummary[] {
  if (!slugs.length) return [];
  const wanted = new Set(slugs);

  return loadAllMeta()
    .filter(({ meta }) => wanted.has(meta.slug))
    .map(({ meta, dir }) => mapToLinkedPost(meta, dir));
}

export function getBacklinks(slug: string): LinkedPostSummary[] {
  if (!slug) return [];

  return loadAllMeta()
    .filter(
      ({ meta }) =>
        meta.slug !== slug && (meta.references ?? []).includes(slug)
    )
    .map(({ meta, dir }) => mapToLinkedPost(meta, dir));
}

export function toLinkedSummary(meta: PostMeta): LinkedPostSummary {
  const dir = TYPE_TO_DIR[meta.type];
  return mapToLinkedPost(meta, dir);
}
