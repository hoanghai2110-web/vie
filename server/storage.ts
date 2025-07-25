import { 
  type User, 
  type InsertUser, 
  type Organization,
  type InsertOrganization,
  type Competition,
  type InsertCompetition,
  type Participant,
  type InsertParticipant,
  type Submission,
  type InsertSubmission,
  type Session,
  type InsertSession,
  users,
  organizations,
  competitions,
  participants,
  submissions,
  sessions
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, desc, asc, and, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getTopUsers(limit?: number): Promise<User[]>;

  // Organizations
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizationByUserId(userId: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined>;

  // Competitions
  getCompetition(id: string): Promise<Competition | undefined>;
  getCompetitions(filters?: { status?: string; category?: string; featured?: boolean }): Promise<Competition[]>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;
  updateCompetition(id: string, updates: Partial<Competition>): Promise<Competition | undefined>;
  getCompetitionsByOrganization(organizationId: string): Promise<Competition[]>;
  getFeaturedCompetitions(limit?: number): Promise<Competition[]>;

  // Participants
  getParticipant(userId: string, competitionId: string): Promise<Participant | undefined>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  getParticipantsByCompetition(competitionId: string): Promise<(Participant & { user: User })[]>;
  getParticipantsByUser(userId: string): Promise<(Participant & { competition: Competition })[]>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByParticipant(participantId: string): Promise<Submission[]>;
  getBestSubmissions(competitionId: string, limit?: number): Promise<(Submission & { participant: Participant & { user: User } })[]>;

  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSession(token: string): Promise<(Session & { user: User }) | undefined>;
  deleteSession(token: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
}

export class DrizzleStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { ...user, id };
    const result = await db.insert(users).values(newUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getTopUsers(limit: number = 10): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.points)).limit(limit);
  }

  // Organizations
  async getOrganization(id: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return result[0];
  }

  async getOrganizationByUserId(userId: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.userId, userId)).limit(1);
    return result[0];
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const id = randomUUID();
    const newOrg = { ...org, id };
    const result = await db.insert(organizations).values(newOrg).returning();
    return result[0];
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization | undefined> {
    const result = await db.update(organizations).set({ ...updates, updatedAt: new Date() }).where(eq(organizations.id, id)).returning();
    return result[0];
  }

  // Competitions
  async getCompetition(id: string): Promise<Competition | undefined> {
    const result = await db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
    return result[0];
  }

  async getCompetitions(filters?: { status?: string; category?: string; featured?: boolean }): Promise<Competition[]> {
    let query = db.select().from(competitions);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(competitions.status, filters.status));
    }
    if (filters?.category) {
      conditions.push(eq(competitions.category, filters.category));
    }
    if (filters?.featured) {
      conditions.push(eq(competitions.isFeatured, filters.featured));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(competitions.createdAt));
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const id = randomUUID();
    const newCompetition = { ...competition, id };
    const result = await db.insert(competitions).values(newCompetition).returning();
    return result[0];
  }

  async updateCompetition(id: string, updates: Partial<Competition>): Promise<Competition | undefined> {
    const result = await db.update(competitions).set({ ...updates, updatedAt: new Date() }).where(eq(competitions.id, id)).returning();
    return result[0];
  }

  async getCompetitionsByOrganization(organizationId: string): Promise<Competition[]> {
    return await db.select().from(competitions).where(eq(competitions.organizationId, organizationId)).orderBy(desc(competitions.createdAt));
  }

  async getFeaturedCompetitions(limit: number = 6): Promise<Competition[]> {
    return await db.select().from(competitions).where(eq(competitions.isFeatured, true)).orderBy(desc(competitions.createdAt)).limit(limit);
  }

  // Participants
  async getParticipant(userId: string, competitionId: string): Promise<Participant | undefined> {
    const result = await db.select().from(participants).where(and(eq(participants.userId, userId), eq(participants.competitionId, competitionId))).limit(1);
    return result[0];
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const id = randomUUID();
    const newParticipant = { ...participant, id };
    const result = await db.insert(participants).values(newParticipant).returning();
    return result[0];
  }

  async getParticipantsByCompetition(competitionId: string): Promise<(Participant & { user: User })[]> {
    return await db.select().from(participants)
      .innerJoin(users, eq(participants.userId, users.id))
      .where(eq(participants.competitionId, competitionId))
      .orderBy(asc(participants.rank));
  }

  async getParticipantsByUser(userId: string): Promise<(Participant & { competition: Competition })[]> {
    return await db.select().from(participants)
      .innerJoin(competitions, eq(participants.competitionId, competitions.id))
      .where(eq(participants.userId, userId))
      .orderBy(desc(participants.joinedAt));
  }

  // Submissions
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const newSubmission = { ...submission, id };
    const result = await db.insert(submissions).values(newSubmission).returning();
    return result[0];
  }

  async getSubmissionsByParticipant(participantId: string): Promise<Submission[]> {
    return await db.select().from(submissions).where(eq(submissions.participantId, participantId)).orderBy(desc(submissions.submittedAt));
  }

  async getBestSubmissions(competitionId: string, limit: number = 20): Promise<(Submission & { participant: Participant & { user: User } })[]> {
    return await db.select().from(submissions)
      .innerJoin(participants, eq(submissions.participantId, participants.id))
      .innerJoin(users, eq(participants.userId, users.id))
      .where(eq(submissions.competitionId, competitionId))
      .orderBy(desc(submissions.score))
      .limit(limit);
  }

  // Sessions
  async createSession(session: InsertSession): Promise<Session> {
    const id = randomUUID();
    const newSession = { ...session, id };
    const result = await db.insert(sessions).values(newSession).returning();
    return result[0];
  }

  async getSession(token: string): Promise<(Session & { user: User }) | undefined> {
    const result = await db.select().from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token))
      .limit(1);
    return result[0];
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(sql`expires_at < NOW()`);
  }
}

export const storage = new DrizzleStorage();
