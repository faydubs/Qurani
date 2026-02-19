
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  completedParts: integer("completed_parts").default(0), // Total parts completed across all khatmahs
  khatmahs: integer("khatmahs").default(0), // Total full completions
  createdAt: timestamp("created_at").defaultNow(),
});

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  juzNumber: integer("juz_number").notNull(), // 1-30
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
});

export const usersRelations = relations(users, ({ many }) => ({
  readings: many(readings),
}));

export const readingsRelations = relations(readings, ({ one }) => ({
  user: one(users, {
    fields: [readings.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
});

export const insertReadingSchema = createInsertSchema(readings).pick({
  userId: true,
  juzNumber: true,
  isCompleted: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Reading = typeof readings.$inferSelect;
export type InsertReading = z.infer<typeof insertReadingSchema>;

// API Types
export type LeaderboardEntry = {
  username: string;
  displayName: string;
  completedParts: number;
  khatmahs: number;
};
