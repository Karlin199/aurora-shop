import { getSheetValues } from "@/lib/googleSheets";
import { nonNegativeNumber, requiredText } from "@/lib/domain/sheetParsing";
import { canonicalPartName } from "@/lib/domain/normalization";

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

  return rows.slice(1).map((row, index) => ({
    product: requiredText("BOM", index + 2, "Product", row[0]),
    part: canonicalPartName(requiredText("BOM", index + 2, "Part Name", row[1])),
    qtyPerUnit: nonNegativeNumber("BOM", index + 2, "Qty Per Unit", row[2]),
  }));

}