import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { PostMeta } from "@/types";

// Enforce server-only execution
export const runtime = "nodejs"; // Next.js hint
export const dynamic = "force-static";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src/content");

// Generic loader for any directory (experiments, notes, etc.)
function loadCollection(dir: string): PostMeta[] {
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

    return {
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      type: dir === "experiments" ? "experiment" : "note",
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
