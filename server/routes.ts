
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Passport)
  setupAuth(app);

  // === READINGS ===
  app.get(api.readings.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const readings = await storage.getReadings(req.user!.id);
    res.json(readings);
  });

  app.post(api.readings.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const { juzNumber, isCompleted } = api.readings.update.input.parse(req.body);
      const updated = await storage.updateReading(req.user!.id, juzNumber, isCompleted);
      
      // Check for Khatmah completion (all 30 parts done)
      // This is a bit implicit. A specific "Finish Khatmah" action might be better, 
      // but let's see if we can auto-detect or if the frontend handles it.
      // For now, we just update the reading.
      
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Custom endpoint to finish khatmah (reset readings + increment count)
  app.post("/api/khatmah/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Verify all 30 are done? Or just trust user?
    // Let's verify.
    const readings = await storage.getReadings(req.user!.id);
    const completedCount = readings.filter(r => r.isCompleted).length;
    
    if (completedCount < 30) {
        return res.status(400).json({ message: "You must complete all 30 parts first." });
    }
    
    await storage.completeKhatmah(req.user!.id);
    res.json({ message: "Khatmah completed! Mabrouk!" });
  });

  // === LEADERBOARD ===
  app.get(api.leaderboard.list.path, async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  // Initialize seed data
  await seedDatabase();

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existingUsers = await storage.getLeaderboard();
  if (existingUsers.length === 0) {
    console.log("Seeding database...");
    // Create some dummy users
    const user1 = await storage.createUser({
      username: "ahmed",
      password: "password123", // In real app, this would be hashed by auth setup
      displayName: "Ahmed Ali",
    });
    
    const user2 = await storage.createUser({
      username: "fatima",
      password: "password123",
      displayName: "Fatima Noor",
    });
    
    // Simulate some progress
    await storage.updateReading(user1.id, 1, true);
    await storage.updateReading(user1.id, 2, true);
    await storage.updateReading(user1.id, 3, true);
    
    await storage.updateReading(user2.id, 1, true);
    
    // Update stats manually for seed data (since updateReading handles it but just to be sure)
    // Actually updateReading handles it.
  }
}
