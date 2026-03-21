// Auto-generated types matching the Supabase schema in supabase/schema.sql
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wg_account_id: number | null;
          wg_nickname: string;
          clan_tag: string | null;
          server: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wg_account_id?: number | null;
          wg_nickname: string;
          clan_tag?: string | null;
          server?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          author_nickname: string;
          author_clan_tag: string | null;
          content: string;
          post_type: "text" | "battle_result" | "achievement" | "tank_review";
          battle_result: Json | null;
          media_url: string | null;
          media_type: "image" | "video" | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          author_nickname: string;
          author_clan_tag?: string | null;
          content: string;
          post_type?: "text" | "battle_result" | "achievement" | "tank_review";
          battle_result?: Json | null;
          media_url?: string | null;
          media_type?: "image" | "video" | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          author_nickname: string;
          author_clan_tag: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          author_nickname: string;
          author_clan_tag?: string | null;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["post_likes"]["Insert"]>;
      };
    };
  };
}
