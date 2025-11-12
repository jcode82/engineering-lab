export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  slug: string;
  type: "experiment" | "note";
}
