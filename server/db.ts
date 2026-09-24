import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { cases, InsertUser, tileRequests, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listCases() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cases).orderBy(desc(cases.updatedAt));
}

export async function createCase(input: typeof cases.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(cases).values(input);
  const rows = await db.select().from(cases).where(eq(cases.caseId, input.caseId)).limit(1);
  return rows[0] ?? null;
}

export async function createTileRequest(input: typeof tileRequests.$inferInsert) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(tileRequests).values(input);
  const rows = await db.select().from(tileRequests).where(eq(tileRequests.tileId, input.tileId)).orderBy(desc(tileRequests.createdAt)).limit(1);
  return rows[0] ?? null;
}
