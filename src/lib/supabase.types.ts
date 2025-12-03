export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      experiments: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          date: string | null;
          tags: string[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          date: string | null;
          tags: string[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      case_studies: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          date: string | null;
          tags: string[] | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          date?: string | null;
          tags?: string[] | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
