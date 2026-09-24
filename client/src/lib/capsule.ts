export type CapsuleAssignment = { x: number; y: number; prototype: number };
export type SemanticCapsule = { case: string; slide: string; coordinate_system: string; assignments: CapsuleAssignment[]; embedding_dim: number; checksum: string };
export function parseCapsule(input: unknown): SemanticCapsule {
  if (!input || typeof input !== "object") throw new Error("Capsule must be an object");
  const value = input as Partial<SemanticCapsule>;
  if (typeof value.case !== "string" || !/^CASE-[A-Z0-9-]+$/.test(value.case)) throw new Error("Invalid case identifier");
  if (typeof value.slide !== "string" || value.slide.length < 3) throw new Error("Invalid slide identifier");
  if (value.coordinate_system !== "level_0") throw new Error("Unsupported coordinate system");
  if (!Array.isArray(value.assignments) || value.assignments.length > 100000) throw new Error("Invalid assignments");
  const assignments = value.assignments.map((item) => {
    if (!item || typeof item !== "object") throw new Error("Invalid assignment");
    const a = item as CapsuleAssignment;
    if (!Number.isInteger(a.x) || a.x < 0 || !Number.isInteger(a.y) || a.y < 0 || !Number.isInteger(a.prototype) || a.prototype < 0 || a.prototype > 999) throw new Error("Invalid assignment coordinates");
    return { x: a.x, y: a.y, prototype: a.prototype };
  });
  if (value.embedding_dim !== 1024) throw new Error("Unexpected embedding dimension");
  if (typeof value.checksum !== "string" || value.checksum.length < 6) throw new Error("Missing checksum");
  return { case: value.case, slide: value.slide, coordinate_system: "level_0", assignments, embedding_dim: 1024, checksum: value.checksum };
}
export function catalogIsUnique(items: Array<{ title: string; url?: string; href?: string }>) { const keys = items.map(item => item.url ?? item.href ?? item.title); return new Set(keys).size === keys.length; }
