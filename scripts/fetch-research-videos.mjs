import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const OUT_DIR = path.resolve("client/public/research/videos");
const TMP_DIR = path.resolve(".research-video-cache");

const SOURCES = [
  {
    pmc: "PMC12307736",
    files: [
      { output: "pmc12307736-movie1.mp4", preferred: "41746_2025_1890_MOESM2_ESM.mp4" },
      { output: "pmc12307736-movie2.mp4", preferred: "41746_2025_1890_MOESM3_ESM.mp4" },
    ],
  },
  {
    pmc: "PMC10905821",
    files: [
      { output: "pmc10905821-video1.mp4", preferred: "40644_2024_669_MOESM3_ESM.mp4" },
    ],
  },
  {
    pmc: "PMC10073663",
    files: [
      { output: "pmc10073663-video1.mp4", preferred: "12966_2023_4572_MOESM2_ESM.mp4" },
    ],
  },
  {
    pmc: "PMC6895055",
    files: [
      { output: "pmc6895055-video1.mp4", preferred: "41598_2019_54961_MOESM2_ESM.mp4" },
      { output: "pmc6895055-video2.mp4", preferred: "41598_2019_54961_MOESM3_ESM.mp4" },
      { output: "pmc6895055-video3.mp4", preferred: "41598_2019_54961_MOESM4_ESM.mp4" },
    ],
  },
];

async function getOpenAccessPackage(pmc) {
  const endpoint = "https://www.ncbi.nlm.nih.gov/pmc/utils/oa/oa.fcgi?id=" + encodeURIComponent(pmc);
  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(60000),
    headers: { Accept: "application/xml,text/xml,*/*" },
  });

  if (!response.ok) {
    throw new Error(pmc + ": OA API returned HTTP " + response.status);
  }

  const xml = await response.text();
  const match = xml.match(/<link[^>]+format="tgz"[^>]+href="([^"]+)"/i);
  if (!match || !match[1]) {
    throw new Error(pmc + ": no open-access tgz package was returned");
  }

  return match[1];
}

async function downloadPackage(pmc, url) {
  const archive = path.join(TMP_DIR, pmc + ".tar.gz");
  const extractDir = path.join(TMP_DIR, pmc);

  await mkdir(extractDir, { recursive: true });

  try {
    await access(archive);
    console.log("[research-media] package cached: " + pmc);
  } catch {
    console.log("[research-media] downloading OA package: " + pmc);
    const response = await fetch(url, {
      signal: AbortSignal.timeout(180000),
      headers: { Accept: "application/gzip,*/*" },
    });

    if (!response.ok) {
      throw new Error(pmc + ": package download returned HTTP " + response.status);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 4096) {
      throw new Error(pmc + ": OA package was unexpectedly small (" + bytes.length + " bytes)");
    }
    await writeFile(archive, bytes);
  }

  await execFileAsync("tar", ["-xzf", archive, "-C", extractDir]);
  return extractDir;
}

async function findMp4s(root) {
  const result = await execFileAsync("find", [root, "-type", "f", "-iname", "*.mp4"]);
  return result.stdout.split("\n").map(v => v.trim()).filter(Boolean);
}

async function installSource(source) {
  const packageUrl = await getOpenAccessPackage(source.pmc);
  const root = await downloadPackage(source.pmc, packageUrl);
  const mp4s = await findMp4s(root);

  if (!mp4s.length) {
    throw new Error(source.pmc + ": OA package contains no MP4 files");
  }

  console.log("[research-media] " + source.pmc + ": found " + mp4s.length + " MP4 asset(s)");

  for (let index = 0; index < source.files.length; index += 1) {
    const file = source.files[index];
    const preferred = mp4s.find(candidate => candidate.toLowerCase().endsWith(file.preferred.toLowerCase()));
    const chosen = preferred || mp4s[index] || mp4s[0];
    const target = path.join(OUT_DIR, file.output);

    if (!chosen) {
      throw new Error(source.pmc + ": could not resolve " + file.output);
    }

    const probe = await execFileAsync("file", ["-b", chosen]);
    if (/html|text|xml/i.test(probe.stdout)) {
      throw new Error(source.pmc + ": resolved asset is not a video: " + probe.stdout.trim());
    }

    await execFileAsync("cp", [chosen, target]);
    console.log("[research-media] installed: " + file.output + " <= " + path.basename(chosen));
  }
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

for (const source of SOURCES) {
  await installSource(source);
}

console.log("[research-media] ready: 7 real local MP4 assets");