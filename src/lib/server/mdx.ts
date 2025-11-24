import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { LinkedPostSummary, PostMeta } from "@/types";

// Enforce server-only execution
export const runtime = "nodejs"; // Next.js hint
export const dynamic = "force-static";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src/content");
type CollectionDir = "experiments" | "notes";
const COLLECTIONS: CollectionDir[] = ["experiments", "notes"];

const DIR_TO_TYPE: Record<CollectionDir, PostMeta["type"]> = {
  experiments: "experiment",
  notes: "note",
};

const DIR_TO_PATH: Record<CollectionDir, string> = {
  experiments: "/experiments",
  notes: "/notes",
};

// Generic loader for any directory (experiments, notes, etc.)
function loadCollection(dir: CollectionDir): PostMeta[] {
  const folder = path.join(CONTENT_ROOT, dir);

  if (!fs.existsSync(folder)) {
    console.warn(`[mdx] Missing content directory: ${folder}`);
    return [];
  }

  const files = fs.readdirSync(folder).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const fullPath = path.join(folder, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    const slug = file.replace(/\.mdx?$/, "");
    return {
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title ?? slug,
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      tags: data.tags || [],
      type: DIR_TO_TYPE[dir],
      references: data.references || [],
    } satisfies PostMeta;
  });
}

// Generic single-file loader
function loadSingle(dir: string, slug: string) {
  const fullPath = path.join(CONTENT_ROOT, dir, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { data, content };
}

// --- PUBLIC APIS ---

// Experiments
export const getAllExperiments = () => loadCollection("experiments");
export const getExperiment = (slug: string) =>
  loadSingle("experiments", slug);

// Notes
export const getAllNotes = () => loadCollection("notes");
export const getNote = (slug: string) => loadSingle("notes", slug);

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
