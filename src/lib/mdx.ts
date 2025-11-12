import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { PostMeta } from "@/types";

const contentRoot = path.join(process.cwd(), "src/content");

export interface ExperimentMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

export function getAllExperiments(): PostMeta[] {
  const dir = path.join(contentRoot, "experiments");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(source);
    return {
      type: "experiment",
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
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

export function getAllNotes(): PostMeta[] {
  const dir = path.join(contentRoot, "notes");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files.map((file) => {
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(source);
    return {
      type: "note",
      slug: file.replace(/\.mdx?$/, ""),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
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
