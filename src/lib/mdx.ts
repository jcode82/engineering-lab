import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "src/content");

export interface ExperimentMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export function getAllExperiments(): ExperimentMeta[] {
  const dir = path.join(contentRoot, "experiments");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(source);
    return {
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    };
  });
}

export function getExperiment(slug: string) {
  const fullPath = path.join(contentRoot, "experiments", `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(source);
  return { content, data };
}

export interface NotesMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export function getAllNotes() {
  const dir = path.join(contentRoot, 'notes');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

  return files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(source);
    return {
      slug: file.replace(/\.mdx?$/, ''),
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    };
  });
}

export function getNote(slug: string) {
  const fullPath = path.join(contentRoot, 'notes', `${slug}.mdx`);
  const source = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(source);
  return { content, data };
}
