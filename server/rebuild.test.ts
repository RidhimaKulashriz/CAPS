import { describe, expect, it } from "vitest";
import { videoResources } from "../client/src/lib/resources";
import { imageResources } from "../client/src/lib/images";
import { catalogIsUnique, parseCapsule } from "../client/src/lib/capsule";

describe("CaPS rebuild validation", () => {
  it("keeps the requested resource minimums and unique identifiers", () => {
    expect(videoResources.length).toBeGreaterThanOrEqual(110);
    expect(imageResources.length).toBeGreaterThanOrEqual(20);
    expect(catalogIsUnique(videoResources)).toBe(true);
    expect(catalogIsUnique(imageResources)).toBe(true);
  });
  it("parses a semantic capsule assignment chain", () => {
    const capsule = parseCapsule({ case: "CASE-042", slide: "WSI-HE-0007", coordinate_system: "level_0", assignments: [{ x: 3842, y: 2991, prototype: 17 }], embedding_dim: 1024, checksum: "8c7a-f1e2" });
    expect(capsule.assignments[0]).toEqual({ x: 3842, y: 2991, prototype: 17 });
  });
  it("rejects unsafe capsule coordinates and malformed identifiers", () => {
    expect(() => parseCapsule({ case: "../../etc", slide: "WSI", coordinate_system: "level_0", assignments: [], embedding_dim: 1024, checksum: "abcdef" })).toThrow();
    expect(() => parseCapsule({ case: "CASE-042", slide: "WSI", coordinate_system: "level_0", assignments: [{ x: -1, y: 0, prototype: 17 }], embedding_dim: 1024, checksum: "abcdef" })).toThrow();
  });
});
