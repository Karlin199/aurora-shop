export const CANONICAL_CHERRY = "Cherrywood";
export const CANONICAL_A_FRAME = "A-frame";

export function canonicalPartName(value: string): string {
  const normalized = value.normalize("NFKC").trim();

  if (normalized.replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-").toLowerCase() === "a-frame" || normalized.toLowerCase() === "aframe") {
    return CANONICAL_A_FRAME;
  }

  return normalized;
}

export function canonicalColour(value: string): string {
  const normalized = value.normalize("NFKC").trim();
  return normalized.toLowerCase() === "cherry" || normalized.toLowerCase() === "cherrywood"
    ? CANONICAL_CHERRY
    : normalized;
}

export function comparisonKey(value: string): string {
  return value.normalize("NFKC").replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
}
