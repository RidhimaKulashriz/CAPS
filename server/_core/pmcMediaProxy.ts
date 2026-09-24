import type { Express } from "express";
import { Readable } from "stream";

const PMC_VIDEO_URLS = [
  "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM2_ESM.mp4",
  "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM3_ESM.mp4",
  "https://pmc.ncbi.nlm.nih.gov/articles/instance/10905821/bin/40644_2024_669_MOESM3_ESM.mp4",
  "https://pmc.ncbi.nlm.nih.gov/articles/instance/10073663/bin/12966_2023_4572_MOESM2_ESM.mp4",
];

export function registerPmcMediaProxy(app: Express) {
  app.get("/api/pmc-media/:index", async (req, res) => {
    const index = Number(req.params.index);
    const target = Number.isInteger(index) ? PMC_VIDEO_URLS[index] : undefined;
    if (!target) {
      res.status(404).send("PMC video not found");
      return;
    }

    try {
      const headers: Record<string, string> = {
        Accept: "video/mp4,*/*",
        "User-Agent": "CaPS research media viewer",
        Referer: "https://pmc.ncbi.nlm.nih.gov/",
      };
      const range = req.headers.range;
      if (range) headers.Range = range;

      const upstream = await fetch(target, { headers, redirect: "follow" });
      if (!upstream.ok && upstream.status !== 206) {
        res.status(upstream.status).send("PMC media unavailable");
        return;
      }

      res.status(upstream.status);
      res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
      for (const name of ["content-length", "content-range", "accept-ranges", "etag", "last-modified"]) {
        const value = upstream.headers.get(name);
        if (value) res.setHeader(name, value);
      }
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.setHeader("X-Content-Type-Options", "nosniff");

      if (!upstream.body) {
        res.end();
        return;
      }
      Readable.fromWeb(upstream.body as any).pipe(res);
    } catch (error) {
      console.error("[PmcMediaProxy] failed:", error);
      if (!res.headersSent) res.status(502).send("PMC media proxy error");
      else res.destroy();
    }
  });
}
