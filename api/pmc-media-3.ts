import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";

export async function servePmc(index: number, req: IncomingMessage, res: ServerResponse) {
  const urls = [
    "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM2_ESM.mp4",
    "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM3_ESM.mp4",
    "https://pmc.ncbi.nlm.nih.gov/articles/instance/10905821/bin/40644_2024_669_MOESM3_ESM.mp4",
    "https://pmc.ncbi.nlm.nih.gov/articles/instance/10073663/bin/12966_2023_4572_MOESM2_ESM.mp4",
  ];
  const target = urls[index];
  if (!target) { res.statusCode = 404; res.end("PMC video not found"); return; }
  try {
    const headers: Record<string,string> = {
      Accept: "video/mp4,*/*",
      "User-Agent": "CaPS research media viewer",
      Referer: "https://pmc.ncbi.nlm.nih.gov/",
    };
    if (req.headers.range) headers.Range = req.headers.range;
    const upstream = await fetch(target, { headers, redirect: "follow" });
    if (!upstream.ok && upstream.status !== 206) {
      res.statusCode = upstream.status; res.end("PMC media unavailable"); return;
    }
    res.statusCode = upstream.status;
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "video/mp4");
    for (const name of ["content-length","content-range","accept-ranges","etag","last-modified"]) {
      const value = upstream.headers.get(name); if (value) res.setHeader(name,value);
    }
    res.setHeader("Cache-Control","public, max-age=3600");
    res.setHeader("X-Content-Type-Options","nosniff");
    if (!upstream.body) { res.end(); return; }
    Readable.fromWeb(upstream.body as any).pipe(res);
  } catch {
    if (!res.headersSent) { res.statusCode=502; res.end("PMC media proxy error"); } else res.destroy();
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) { await servePmc(3, req, res); }
