export interface BasePostMeta {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  slug: string;
}

export interface ExperimentMeta extends BasePostMeta {}
export interface NoteMeta extends BasePostMeta {}
