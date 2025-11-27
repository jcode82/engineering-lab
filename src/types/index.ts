export type PostKind = "experiment" | "note" | "case-study";

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  slug: string;
  type: PostKind;
  references?: string[];
  status?: string;
}

export interface LinkedPostSummary {
  slug: string;
  title: string;
  type: PostKind;
  href: string;
}
