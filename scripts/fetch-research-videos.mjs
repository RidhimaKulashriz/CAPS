import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("client/public/research/videos");

const VIDEOS = [
  {
    file: "pmc12307736-movie1.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM2_ESM.mp4",
  },
  {
    file: "pmc12307736-movie2.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM3_ESM.mp4",
  },
  {
    file: "pmc10905821-video1.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10905821/bin/40644_2024_669_MOESM3_ESM.mp4",
  },
  {
    file: "pmc10073663-video1.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10073663/bin/12966_2023_4572_MOESM2_ESM.mp4",
  },
  {
    file: "pmc6895055-video1.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/6895055/bin/41598_2019_54961_MOESM2_ESM.mp4",
  },
  {
    file: "pmc6895055-video2.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/6895055/bin/41598_2019_54961_MOESM3_ESM.mp4",
  },
  {
    file: "pmc6895055-video3.mp4",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/instance/6895055/bin/41598_2019_54961_MOESM4_ESM.mp4",
  },
];

async function downloadVideo(video) {
  const target = path.join(OUT_DIR, video.file);

  try {
    await access(target);
    console.log(`[research-media] cached: ${video.file}`);
    return;
  } catch {}

  console.log(`[research-media] downloading: ${video.file}`);

  const response = await fetch(video.url, {
    redirect: "follow",
    signal: AbortSignal.timeout(120000),
    headers: {
      Accept: "video/mp4,application/octet-stream,*/*",
      Referer: "https://pmc.ncbi.nlm.nih.gov/",
      "User-Agent": "Mozilla/5.0 CaPS research media fetcher",
    },
  });

  if (!response.ok) {
    throw new Error(`${video.file}: upstream returned HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());

  if (bytes.length < 1024) {
    throw new Error(`${video.file}: response was unexpectedly small (${bytes.length} bytes)`);
  }

  await writeFile(target, bytes);
  console.log(`[research-media] saved: ${video.file} (${bytes.length.toLocaleString()} bytes)`);
}

await mkdir(OUT_DIR, { recursive: true });

for (const video of VIDEOS) {
  await downloadVideo(video);
}

console.log(`[research-media] ready: ${VIDEOS.length} real MP4 assets`);
