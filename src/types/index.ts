export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  slug: string;
  type: "experiment" | "note";
  references?: string[];
}

export interface LinkedPostSummary {
  slug: string;
  title: string;
  type: "experiment" | "note";
  href: string;
}
