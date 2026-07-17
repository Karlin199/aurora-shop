import { getSheetValues } from "@/lib/googleSheets";

const SHEET = "Piece Jobs";

export type PieceJob = {
  job: string;
  rate: number;
  unit: string;
};

export async function getPieceJobs(): Promise<PieceJob[]> {
  const rows = await getSheetValues(SHEET);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
    job: String(row[0] ?? "").trim(),
    rate: Number(row[1] ?? 0),
    unit: String(row[2] ?? "").trim(),
  }));
}