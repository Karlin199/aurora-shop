import { getSheetValues } from "@/lib/googleSheets";

export type BomItem = {
  product: string;
  part: string;
  qtyPerUnit: number;
};

export async function getBom(): Promise<BomItem[]> {

  const rows = await getSheetValues("BOM");

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row) => ({
    product: row[0] ?? "",
    part: row[1] ?? "",
    qtyPerUnit: Number(row[2] ?? 0),
  }));

}