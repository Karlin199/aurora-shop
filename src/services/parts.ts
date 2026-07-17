import { getSheetValues } from "@/lib/googleSheets";

export type Part = {
  name: string;
  primaryMachine: string;
  cncFile: string;
  partsPerBoard: number;
  oneDriveLink: string;
};

const SHEET = "Parts";

export async function getParts(): Promise<Part[]> {
  const rows = await getSheetValues(SHEET);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
   name: String(row[0] ?? "").trim(),
   primaryMachine: String(row[1] ?? "").trim(),
   cncFile: String(row[2] ?? "").trim(),
   partsPerBoard: Number(row[3] ?? 0),
   oneDriveLink: String(row[4] ?? "").trim(),
  }));
}

export async function getCNCParts() {
  const parts = await getParts();

  return parts.filter(
    (part) => part.cncFile !== ""
  );
}