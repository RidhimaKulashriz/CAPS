import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const cases = mysqlTable("cases", {
  id: int("id").autoincrement().primaryKey(),
  caseId: varchar("caseId", { length: 64 }).notNull().unique(),
  slideId: varchar("slideId", { length: 128 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ready", "processing", "review"]).default("ready").notNull(),
  patchCount: int("patchCount").notNull(),
  rawWsiSize: varchar("rawWsiSize", { length: 32 }).notNull(),
  capsuleSize: varchar("capsuleSize", { length: 32 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const tileRequests = mysqlTable("tileRequests", {
  id: int("id").autoincrement().primaryKey(),
  caseId: varchar("caseId", { length: 64 }).notNull(),
  tileId: varchar("tileId", { length: 64 }).notNull(),
  x: int("x").notNull(),
  y: int("y").notNull(),
  width: int("width").notNull(),
  height: int("height").notNull(),
  level: int("level").notNull(),
  status: mysqlEnum("status", ["requested", "rendered", "failed"]).default("requested").notNull(),
  latencyMs: int("latencyMs").notNull(),
  bytesReceived: int("bytesReceived").notNull(),
  cacheStatus: mysqlEnum("cacheStatus", ["hit", "miss"]).default("hit").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Case = typeof cases.$inferSelect;
export type TileRequest = typeof tileRequests.$inferSelect;
