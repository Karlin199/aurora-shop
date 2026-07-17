import { getSheetValues, updateCell } from "@/lib/googleSheets";

const SHEET = "Piece Entries";

export type EmployeeBalance = {
  employee: string;
  total: number;
  entries: number;
};

export type PieceworkEntry = {
  row: number;
  employee: string;
  job: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
  paid: boolean;
};

export async function getEmployeeBalances(): Promise<EmployeeBalance[]> {
  const rows = await getSheetValues(SHEET);

  const balances = new Map<string, EmployeeBalance>();

  rows.slice(1).forEach((row) => {
    const paid =
      String(row[6]).toUpperCase() === "TRUE";

    if (paid) return;

    const employee = String(row[0]);

    const total = Number(row[4]);

    const current = balances.get(employee);

    if (current) {
      current.total += total;
      current.entries++;
    } else {
      balances.set(employee, {
        employee,
        total,
        entries: 1,
      });
    }
  });

  return [...balances.values()].sort(
    (a, b) => b.total - a.total
  );
}

export async function getEmployeeEntries(
  employee: string
): Promise<PieceworkEntry[]> {

  const rows = await getSheetValues(SHEET);

  return rows
    .slice(1)
    .map((row, index) => ({
      row: index + 2,
      employee: String(row[0]),
      job: String(row[1]),
      quantity: Number(row[2]),
      rate: Number(row[3]),
      total: Number(row[4]),
      date: String(row[5]),
      paid:
        String(row[6]).toUpperCase() === "TRUE",
    }))
    .filter(
      (entry) =>
        entry.employee === employee &&
        !entry.paid
    );
}

export async function payEmployee(
  employee: string
) {

  const rows = await getSheetValues(SHEET);

  for (let i = 1; i < rows.length; i++) {

    const row = rows[i];

    if (
      String(row[0]) === employee &&
      String(row[6]).toUpperCase() !== "TRUE"
    ) {

      await updateCell(
        SHEET,
        i + 1,
        7,
        "TRUE"
      );

    }

  }

}