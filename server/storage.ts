
import { db } from "./db";
import { users, readings, type User, type InsertUser, type Reading, type InsertReading } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getReadings(userId: number): Promise<Reading[]>;
  updateReading(userId: number, juzNumber: number, isCompleted: boolean): Promise<Reading>;
  
  getLeaderboard(): Promise<{
    username: string;
    displayName: string;
    completedParts: number;
    khatmahs: number;
  }[]>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getReadings(userId: number): Promise<Reading[]> {
    return await db.select().from(readings).where(eq(readings.userId, userId));
  }

  async updateReading(userId: number, juzNumber: number, isCompleted: boolean): Promise<Reading> {
    // Check if reading exists
    const [existing] = await db
      .select()
      .from(readings)
      .where(
        sql`${readings.userId} = ${userId} AND ${readings.juzNumber} = ${juzNumber}`
      );

    let result: Reading;
    if (existing) {
      const [updated] = await db
        .update(readings)
        .set({ isCompleted, completedAt: isCompleted ? new Date() : null })
        .where(eq(readings.id, existing.id))
        .returning();
      result = updated;
    } else {
      const [inserted] = await db
        .insert(readings)
        .values({
          userId,
          juzNumber,
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        })
        .returning();
      result = inserted;
    }

    // Recalculate stats for user
    await this.updateUserStats(userId);
    return result;
  }

  private async updateUserStats(userId: number) {
    const userReadings = await this.getReadings(userId);
    const completedCount = userReadings.filter(r => r.isCompleted).length;
    
    // Simple logic: every 30 parts is a khatmah. 
    // Note: In a real app, we might want to group them by specific khatmah instances,
    // but for this MVP, we'll just track total completed parts and derive khatmahs.
    // However, the prompt implies "recording each Juz". 
    // Let's assume the user resets or we just count total parts. 
    // For simplicity: completedParts is just the count of checked boxes (max 30 in current UI).
    // BUT, the prompt says "Every additional full completion (Khatmah) adds another crown."
    // This implies we need to track *history* or allow resetting.
    // For MVP: We will stick to 1 active khatmah tracking.
    // Ideally, we'd have a 'khatmah_id' in readings.
    // Let's implement a simplified logic: 
    // If all 30 are done, the user gets a "Khatmah" count incremented and the board resets?
    // Or maybe just manual reset.
    // Let's stick to: completedParts = count of TRUE readings. 
    // Khatmahs = stored in user table (maybe manually incremented or we just use completedParts / 30 if we allowed > 30).
    // Given the schema `completedParts` in `users`, let's just update that.
    
    await db.update(users)
      .set({ completedParts: completedCount })
      .where(eq(users.id, userId));
      
    // If we want to support multiple Khatmahs, we might need a "finish khatmah" button
    // which increments khatmah count and resets readings.
    // I'll add logic for that in the route handler or here if needed.
  }
  
  // Helper to increment khatmah
  async completeKhatmah(userId: number): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
        // Increment khatmah count
        await db.update(users)
            .set({ khatmahs: (user.khatmahs || 0) + 1 })
            .where(eq(users.id, userId));
            
        // Reset readings
        await db.update(readings)
            .set({ isCompleted: false, completedAt: null })
            .where(eq(readings.userId, userId));
            
        await this.updateUserStats(userId); // Will reset completedParts to 0
    }
  }

  async getLeaderboard(): Promise<{ username: string; displayName: string; completedParts: number; khatmahs: number }[]> {
    return await db
      .select({
        username: users.username,
        displayName: users.displayName,
        completedParts: users.completedParts,
        khatmahs: users.khatmahs,
      })
      .from(users)
      .orderBy(desc(users.khatmahs), desc(users.completedParts))
      .limit(50);
  }
}

export const storage = new DatabaseStorage();
