import { getSheetValues } from "@/lib/googleSheets";

const SHEET = "Employees";

export type Employee = {
  name: string;
  active: boolean;
};

export async function getEmployees(): Promise<Employee[]> {
  const rows = await getSheetValues(SHEET);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
    name: String(row[0] ?? "").trim(),
    active: String(row[1] ?? "").toUpperCase() === "TRUE",
  }));
}

export async function getActiveEmployees(): Promise<Employee[]> {
  const employees = await getEmployees();

  return employees.filter((employee) => employee.active);
}