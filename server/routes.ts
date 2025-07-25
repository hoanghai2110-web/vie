import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, registerSchema, insertCompetitionSchema, insertParticipantSchema, insertSubmissionSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const upload = multer({ dest: "uploads/" });

// Middleware to verify JWT token
async function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(credentials.email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { ...user, password: undefined },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ ...req.user, password: undefined });
  });

  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // Competition routes
  app.get("/api/competitions", async (req, res) => {
    try {
      const { status, category, featured } = req.query;
      const filters: any = {};
      
      if (status) filters.status = status as string;
      if (category) filters.category = category as string;
      if (featured) filters.featured = featured === 'true';

      const competitions = await storage.getCompetitions(filters);
      res.json(competitions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/competitions/featured", async (req, res) => {
    try {
      const competitions = await storage.getFeaturedCompetitions(6);
      res.json(competitions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.getCompetition(req.params.id);
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json(competition);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/competitions", authenticateToken, async (req: any, res) => {
    try {
      // Check if user has an organization
      const organization = await storage.getOrganizationByUserId(req.user.id);
      if (!organization) {
        return res.status(403).json({ message: "Organization account required" });
      }

      const competitionData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition({
        ...competitionData,
        organizationId: organization.id,
      });

      res.status(201).json(competition);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Participant routes
  app.post("/api/competitions/:id/join", authenticateToken, async (req: any, res) => {
    try {
      const competitionId = req.params.id;
      const userId = req.user.id;

      // Check if already participating
      const existing = await storage.getParticipant(userId, competitionId);
      if (existing) {
        return res.status(400).json({ message: "Already participating" });
      }

      // Check if competition exists
      const competition = await storage.getCompetition(competitionId);
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }

      const participant = await storage.createParticipant({
        userId,
        competitionId,
        teamName: req.body.teamName,
      });

      res.status(201).json(participant);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/competitions/:id/participants", async (req, res) => {
    try {
      const participants = await storage.getParticipantsByCompetition(req.params.id);
      res.json(participants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Submission routes
  app.post("/api/competitions/:id/submit", authenticateToken, upload.single('file'), async (req: any, res) => {
    try {
      const competitionId = req.params.id;
      const userId = req.user.id;

      // Check if participating
      const participant = await storage.getParticipant(userId, competitionId);
      if (!participant) {
        return res.status(403).json({ message: "Not participating in this competition" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File required" });
      }

      // In a real implementation, you would upload to cloud storage
      const fileUrl = `/uploads/${req.file.filename}`;

      const submission = await storage.createSubmission({
        participantId: participant.id,
        competitionId,
        fileName: req.file.originalname,
        fileUrl,
        fileSize: req.file.size,
      });

      res.status(201).json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/competitions/:id/leaderboard", async (req, res) => {
    try {
      const submissions = await storage.getBestSubmissions(req.params.id, 20);
      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User routes
  app.get("/api/users/leaderboard", async (req, res) => {
    try {
      const users = await storage.getTopUsers(10);
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/:id/competitions", async (req, res) => {
    try {
      const participants = await storage.getParticipantsByUser(req.params.id);
      res.json(participants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Organization routes
  app.post("/api/organizations", authenticateToken, async (req: any, res) => {
    try {
      // Check if user already has an organization
      const existing = await storage.getOrganizationByUserId(req.user.id);
      if (existing) {
        return res.status(400).json({ message: "User already has an organization" });
      }

      const organization = await storage.createOrganization({
        userId: req.user.id,
        ...req.body,
      });

      // Update user role to organization
      await storage.updateUser(req.user.id, { role: 'organization' });

      res.status(201).json(organization);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
