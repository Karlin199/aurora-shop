import { getSheetValues } from "@/lib/googleSheets";

export async function getProducts() {
  const rows = await getSheetValues("Products");

  return rows
    .filter((row) => row[0])
    .map((row) => ({
      name: row[0].trim(),
    }));
}

export async function getColours() {
  const rows = await getSheetValues("Colours");

  return rows
    .filter((row) => row[0])
    .map((row) => ({
      name: row[0].trim(),
    }));
}

export async function getCustomers() {
  const rows = await getSheetValues("Customers");

  return rows
    .filter((row) => row[0])
    .map((row) => ({
      name: row[0].trim(),
    }));
}