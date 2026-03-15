import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tournamentsTable = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("upcoming"),
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(),
  prize_pool: text("prize_pool"),
  max_participants: integer("max_participants"),
  current_participants: integer("current_participants").notNull().default(0),
  format: text("format").notNull(),
  tier_requirement: integer("tier_requirement"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournamentsTable).omit({ id: true, created_at: true });
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournamentsTable.$inferSelect;
