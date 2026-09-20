import { getSheetValues } from "@/lib/googleSheets";
import { canonicalPartName, canonicalColour } from "@/lib/domain/normalization";
import { nonNegativeNumber, positiveInteger, requiredText, SheetValidationAggregateError, SheetValidationError } from "@/lib/domain/sheetParsing";

export type Part = {
  name: string;
  primaryMachine: string;
  cncFile: string;
  partsPerBoard: number;
  oneDriveLink: string;
  fixedColor: string;
};

const SHEET = "Parts";

export async function getParts(): Promise<Part[]> {
  const rows = await getSheetValues(SHEET);

  if (rows.length <= 1) {
    return [];
  }

  return rows.slice(1).map((row, index) => ({
   name: canonicalPartName(requiredText(SHEET, index + 2, "Part Name", row[0])),
   primaryMachine: String(row[1] ?? "").trim(),
   cncFile: String(row[2] ?? "").trim(),
   partsPerBoard: row[3]?.trim() ? nonNegativeNumber(SHEET, index + 2, "Parts Per Board", row[3]) : 0,
   oneDriveLink: String(row[4] ?? "").trim(),
   fixedColor: row[5]?.trim() ? canonicalColour(row[5]) : "",
  }));
}

export type CncFile = {
  fileName: string;
  partName: string;
  qtyPerBoard: number;
  boardsPerFile: number;
  multiColor: boolean;
  fixedColor: string;
  runDriver: boolean;
};

export async function getCNCFiles(): Promise<CncFile[]> {
  const rows = await getSheetValues("CNC Files");
  const errors: SheetValidationError[] = [];
  const parsed: CncFile[] = [];
  const keys = new Map<string, number>();
  const driverFiles = new Set<string>();

  rows.slice(1).forEach((row, index) => {
    const sheetRow = index + 2;
    const fileName = String(row[0] ?? "").trim();
    const partName = canonicalPartName(String(row[1] ?? "").trim());
    const multiColor = String(row[4] ?? "").trim().toUpperCase();
    const runDriver = String(row[6] ?? "").trim().toUpperCase();
    try {
      if (multiColor !== "TRUE" && multiColor !== "FALSE") {
        throw new SheetValidationError("CNC Files", sheetRow, "MultiColor", "value must be TRUE or FALSE");
      }
      if (runDriver !== "TRUE" && runDriver !== "FALSE") {
        throw new SheetValidationError("CNC Files", sheetRow, "RunDriver", "value must be TRUE or FALSE");
      }
      const key = `${fileName}|${partName}`;
      if (keys.has(key)) {
        throw new SheetValidationError("CNC Files", sheetRow, "FileName/PartName", `duplicate logical mapping; first appears on row ${keys.get(key)}`);
      }
      keys.set(key, sheetRow);
      const fixedColor = row[5]?.trim() ? canonicalColour(row[5]) : "";
      if (multiColor === "FALSE" && !fixedColor) {
        throw new SheetValidationError("CNC Files", sheetRow, "FixedColor", "value is required when MultiColor is FALSE");
      }
      if (multiColor === "TRUE" && fixedColor) {
        throw new SheetValidationError("CNC Files", sheetRow, "FixedColor", "value must be blank when MultiColor is TRUE");
      }
      const item: CncFile = {
        fileName: requiredText("CNC Files", sheetRow, "FileName", row[0]),
        partName: canonicalPartName(requiredText("CNC Files", sheetRow, "PartName", row[1])),
        qtyPerBoard: positiveInteger("CNC Files", sheetRow, "QtyPerBoard", row[2]),
        boardsPerFile: positiveInteger("CNC Files", sheetRow, "BoardsPerFile", row[3]),
        multiColor: multiColor === "TRUE",
        fixedColor,
        runDriver: runDriver === "TRUE",
      };
      if (item.runDriver) driverFiles.add(item.fileName);
      parsed.push(item);
    } catch (error) {
      if (error instanceof SheetValidationError) errors.push(error);
      else throw error;
    }
  });

  for (const fileName of new Set(parsed.map((item) => item.fileName))) {
    if (!driverFiles.has(fileName)) {
      errors.push(new SheetValidationError("CNC Files", 0, "RunDriver", `file ${fileName} has no RunDriver=TRUE output`));
    }
  }
  const driversByPart = new Map<string, CncFile[]>();
  for (const item of parsed.filter((item) => item.runDriver)) {
    const routes = driversByPart.get(item.partName) ?? [];
    routes.push(item);
    driversByPart.set(item.partName, routes);
  }
  for (const [partName, routes] of driversByPart) {
    if (routes.length > 1) {
      errors.push(new SheetValidationError("CNC Files", 0, "RunDriver", `ambiguous driver routes for ${partName}`));
    }
  }
  if (errors.length > 0) throw new SheetValidationAggregateError(errors);
  return parsed;
}

export async function getCNCParts() {
  const parts = await getParts();

  return parts.filter(
    (part) => part.cncFile !== ""
  );
}