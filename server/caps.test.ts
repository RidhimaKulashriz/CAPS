import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("CaPS public procedures", () => {
  it("lists the deterministic demo cases when storage has no rows", async () => {
    const result = await appRouter.createCaller(createContext()).cases.list();
    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result[0]?.caseId).toBe("CASE-042");
  });

  it("returns a rendered bounded tile request in replay mode", async () => {
    const result = await appRouter.createCaller(createContext()).tiles.request({
      caseId: "CASE-042", tileId: "tile-042", x: 3842, y: 2991, width: 224, height: 224, level: 0,
    });
    expect(result.status).toBe("rendered");
    expect(result.bytesReceived).toBe(148000);
    expect(result.cacheStatus).toBe("hit");
  });

  it("rejects unbounded tile dimensions", async () => {
    await expect(appRouter.createCaller(createContext()).tiles.request({
      caseId: "CASE-042", tileId: "tile-042", x: 0, y: 0, width: 4096, height: 224, level: 0,
    })).rejects.toThrow();
  });
});
