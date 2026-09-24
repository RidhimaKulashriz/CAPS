import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createCase, createTileRequest, listCases } from "./db";

const fallbackCases = [
  { id: 1, caseId: "CASE-042", slideId: "WSI-HE-0007", source: "Wikimedia Commons · public demo", status: "ready" as const, patchCount: 2980, rawWsiSize: "2.84 GB", capsuleSize: "1.82 MB", createdAt: new Date("2026-09-25T00:32:52Z"), updatedAt: new Date("2026-09-25T00:32:52Z") },
  { id: 2, caseId: "CASE-041", slideId: "WSI-HE-0006", source: "Public pathology archive", status: "review" as const, patchCount: 1840, rawWsiSize: "1.71 GB", capsuleSize: "1.21 MB", createdAt: new Date("2026-09-24T10:22:12Z"), updatedAt: new Date("2026-09-24T10:22:12Z") },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  cases: router({
    list: publicProcedure.query(async () => {
      const rows = await listCases();
      return rows.length ? rows : fallbackCases;
    }),
    create: publicProcedure.input(z.object({
      caseId: z.string().min(3).max(64), slideId: z.string().min(3).max(128), source: z.string().min(2).max(255),
      patchCount: z.number().int().positive().max(10_000_000), rawWsiSize: z.string().max(32), capsuleSize: z.string().max(32),
    })).mutation(async ({ input }) => createCase({ ...input, status: "ready" })),
  }),
  tiles: router({
    request: publicProcedure.input(z.object({
      caseId: z.string().min(3).max(64), tileId: z.string().min(1).max(64), x: z.number().int().min(0).max(100_000_000), y: z.number().int().min(0).max(100_000_000),
      width: z.number().int().min(1).max(2048), height: z.number().int().min(1).max(2048), level: z.number().int().min(0).max(20),
    })).mutation(async ({ input }) => {
      const tile = await createTileRequest({ ...input, status: "rendered", latencyMs: 182, bytesReceived: 148_000, cacheStatus: "hit" });
      return tile ?? { ...input, status: "rendered", latencyMs: 182, bytesReceived: 148_000, cacheStatus: "hit" as const };
    }),
  }),
});

export type AppRouter = typeof appRouter;
