import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  author_id: integer("author_id").notNull(),
  author_nickname: text("author_nickname").notNull(),
  author_clan_tag: text("author_clan_tag"),
  content: text("content").notNull(),
  image_url: text("image_url"),
  likes_count: integer("likes_count").notNull().default(0),
  comments_count: integer("comments_count").notNull().default(0),
  post_type: text("post_type").notNull().default("text"),
  battle_result_tank: text("battle_result_tank"),
  battle_result_damage: integer("battle_result_damage"),
  battle_result_frags: integer("battle_result_frags"),
  battle_result_xp: integer("battle_result_xp"),
  battle_result_outcome: text("battle_result_outcome"),
  battle_result_map: text("battle_result_map"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertPostSchema = createInsertSchema(postsTable).omit({ id: true, created_at: true, likes_count: true, comments_count: true });
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof postsTable.$inferSelect;

export const postLikesTable = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  post_id: integer("post_id").notNull(),
  user_session: text("user_session").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
