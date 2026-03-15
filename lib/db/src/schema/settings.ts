import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  session_id: text("session_id").notNull().unique(),
  account_id: integer("account_id"),
  wg_nickname: text("wg_nickname"),
  server: text("server").notNull().default("eu"),
  notifications_enabled: boolean("notifications_enabled").notNull().default(true),
  theme: text("theme").notNull().default("dark"),
  language: text("language").notNull().default("en"),
  show_clan_tag: boolean("show_clan_tag").notNull().default(true),
  privacy_mode: boolean("privacy_mode").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, created_at: true, updated_at: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
