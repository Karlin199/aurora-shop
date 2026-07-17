import {
  getSheetValues,
  appendSheetValues,
} from "@/lib/googleSheets";

const ENTRY_SHEET = "Piece Entries";

export type PieceEntry = {
  employee: string;
  job: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
  paid: boolean;
};

export async function getEntries(): Promise<PieceEntry[]> {
  const rows = await getSheetValues(ENTRY_SHEET);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
    employee: String(row[0] ?? ""),
    job: String(row[1] ?? ""),
    quantity: Number(row[2] ?? 0),
    rate: Number(row[3] ?? 0),
    total: Number(row[4] ?? 0),
    date: String(row[5] ?? ""),
    paid: String(row[6] ?? "").toUpperCase() === "TRUE",
  }));
}

export async function addEntry(
  employee: string,
  job: string,
  quantity: number,
  rate: number
) {
  const total = quantity * rate;

  await appendSheetValues(ENTRY_SHEET, [
    [
     employee,
     job,
     quantity.toString(),
     rate.toString(),
     total.toString(),
     new Date().toISOString(),
     "FALSE",
    ]
  ]);

  return {
    success: true,
    total,
  };
}

export async function getEmployeeBalance(
  employee: string
) {
  const entries = await getEntries();

  return entries
    .filter(
      (entry) =>
        entry.employee === employee &&
        !entry.paid
    )
    .reduce(
      (sum, entry) => sum + entry.total,
      0
    );
}

export async function getEmployeeEntries(
  employee: string
) {
  const entries = await getEntries();

  return entries.filter(
    (entry) => entry.employee === employee
  );
}