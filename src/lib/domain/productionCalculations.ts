import { canonicalColour, canonicalPartName } from "./normalization.ts";
import {
  calculateCncRun,
  calculateGroupedCncRuns,
  type CncProductionRecommendation,
  type CncRunPlan,
} from "./cncCalculations.ts";

export type CalculationOrder = {
  status: "Waiting" | "Completed";
  items: { item: string; color: string; qty: number }[];
};

export type CalculationBomItem = {
  product: string;
  part: string;
  qtyPerUnit: number;
};

export type CalculationInventoryItem = {
  part: string;
  colour: string;
  quantity: number;
};

export type CalculationPart = {
  name: string;
  fixedColor: string;
  primaryMachine: string;
  cncFile?: string;
};

export type CalculationCncFile = {
  fileName: string;
  partName: string;
  qtyPerBoard: number;
  boardsPerFile: number;
  multiColor: boolean;
  fixedColor: string;
  runDriver: boolean;
};

export type Requirement = {
  part: string;
  color: string;
  required: number;
  inStock: number;
  shortage: number;
  cnc?: CncRunPlan;
  cncFile?: string;
  machine: string;
};

export type ProductionCalculation = {
  requirements: Requirement[];
  cncRuns: CncProductionRecommendation[];
};

function isCncMachine(value: string): boolean {
  return value.normalize("NFKC").trim().toUpperCase() === "CNC";
}

function validateCncPart(
  part: CalculationPart,
  cncFile: CalculationCncFile | undefined,
): void {
  if (!isCncMachine(part.primaryMachine)) return;

  const partName = canonicalPartName(part.name);
  const partsCncFile = part.cncFile;
  if (typeof partsCncFile !== "string" || !partsCncFile.trim()) {
    throw new Error(`CNC metadata is invalid for ${partName}: Parts.CNC File is blank`);
  }
  if (!cncFile) {
    throw new Error(`CNC mapping is missing for CNC part ${partName}`);
  }
  if (partsCncFile.trim() !== cncFile.fileName.trim()) {
    throw new Error(`CNC metadata is invalid for ${partName}: Parts.CNC File does not match CNC Files.FileName`);
  }
  if (!cncFile.fileName.trim() || !cncFile.partName.trim()) {
    throw new Error(`CNC mapping is invalid for CNC part ${partName}: FileName and PartName are required`);
  }
  if (!Number.isFinite(cncFile.qtyPerBoard) || cncFile.qtyPerBoard <= 0) {
    throw new Error(`CNC mapping is invalid for CNC part ${partName}: QtyPerBoard must be positive`);
  }
  if (!Number.isFinite(cncFile.boardsPerFile) || cncFile.boardsPerFile <= 0) {
    throw new Error(`CNC mapping is invalid for CNC part ${partName}: BoardsPerFile must be positive`);
  }
  if (!cncFile.multiColor && !cncFile.fixedColor.trim()) {
    throw new Error(`CNC mapping is invalid for CNC part ${partName}: FixedColor is required when MultiColor is false`);
  }
}

export function calculateProduction(
  orders: CalculationOrder[],
  bom: CalculationBomItem[],
  inventory: CalculationInventoryItem[],
  parts: CalculationPart[],
  cncFiles: CalculationCncFile[],
): Requirement[] {
  const cncMappingsByPart = new Map<string, CalculationCncFile[]>();
  for (const cncFile of cncFiles) {
    const part = canonicalPartName(cncFile.partName);
    const mappings = cncMappingsByPart.get(part) ?? [];
    mappings.push(cncFile);
    cncMappingsByPart.set(part, mappings);
  }

  const bomByProduct = new Map<string, CalculationBomItem[]>();
  for (const item of bom) {
    const current = bomByProduct.get(item.product) ?? [];
    current.push(item);
    bomByProduct.set(item.product, current);
  }

  const requirements = new Map<string, { part: string; color: string; required: number }>();

  for (const order of orders) {
    if (order.status === "Completed") continue;
    if (order.status !== "Waiting") throw new Error(`Unknown order status: ${order.status}`);

    for (const item of order.items) {
      const bomItems = bomByProduct.get(item.item);
      if (!bomItems || bomItems.length === 0) {
        throw new Error(`Product has no BOM: ${item.item}`);
      }
      if (!Number.isFinite(item.qty) || item.qty <= 0) {
        throw new Error(`Invalid order quantity for ${item.item}: ${item.qty}`);
      }

      for (const bomItem of bomItems) {
        const part = canonicalPartName(bomItem.part);
        const partInfo = parts.find((candidate) => canonicalPartName(candidate.name) === part);
        const cncMappings = cncMappingsByPart.get(part) ?? [];
        const drivers = cncMappings.filter((mapping) => mapping.runDriver);
        if (cncMappings.length > 1 && (drivers.length !== 1 || new Set(cncMappings.map((mapping) => mapping.fileName)).size !== cncMappings.length)) {
          throw new Error(`Duplicate CNC mappings for ${part}`);
        }
        const cncForPart = drivers[0] ?? cncMappings[0];
        if (cncForPart && cncMappings.some((mapping) => mapping.multiColor !== cncForPart.multiColor || canonicalColour(mapping.fixedColor) !== canonicalColour(cncForPart.fixedColor))) {
          throw new Error(`Inconsistent CNC output colors for ${part}`);
        }
        if (!partInfo) {
          throw new Error(`Part metadata is missing for ${part}`);
        }
        validateCncPart(partInfo, cncForPart);
        for (const mapping of cncMappings) {
          // Byproducts have independent capacities, even when another file drives demand.
          validateCncPart({ ...partInfo, cncFile: mapping.fileName }, mapping);
        }
        const fixedColor = cncForPart && !cncForPart.multiColor
          ? cncForPart.fixedColor
          : partInfo?.fixedColor;
        const color = canonicalColour(fixedColor || item.color);
        const key = `${part}|${color}`;
        const current = requirements.get(key) ?? { part, color, required: 0 };
        current.required += bomItem.qtyPerUnit * item.qty;
        requirements.set(key, current);
      }
    }
  }

  return [...requirements.values()].map((requirement) => {
    const matchingInventory = inventory.filter((item) =>
      canonicalPartName(item.part) === requirement.part && canonicalColour(item.colour) === requirement.color,
    );
    if (matchingInventory.length === 0) {
      throw new Error(`Inventory row is missing for ${requirement.part} (${requirement.color})`);
    }
    const inStock = matchingInventory.reduce((sum, item) => sum + item.quantity, 0);
    const partInfo = parts.find((candidate) => canonicalPartName(candidate.name) === requirement.part);
    const cncMappings = cncMappingsByPart.get(requirement.part) ?? [];
    const cncFile = cncMappings.find((file) => file.runDriver) ?? cncMappings[0];
    const shortage = Math.max(requirement.required - inStock, 0);

    return {
      ...requirement,
      inStock,
      shortage,
      machine: partInfo?.primaryMachine ?? "Unassigned",
      cnc: cncFile && shortage > 0 ? calculateCncRun(shortage, cncFile.qtyPerBoard, cncFile.boardsPerFile) : undefined,
      cncFile: cncFile?.fileName,
    };
  });
}

export function calculateProductionPlan(
  orders: CalculationOrder[],
  bom: CalculationBomItem[],
  inventory: CalculationInventoryItem[],
  parts: CalculationPart[],
  cncFiles: CalculationCncFile[],
): ProductionCalculation {
  const requirements = calculateProduction(orders, bom, inventory, parts, cncFiles);
  const cncRuns = calculateGroupedCncRuns(
    requirements,
    cncFiles.map((file) => ({
      fileName: file.fileName,
      partName: file.partName,
      qtyPerBoard: file.qtyPerBoard,
      boardsPerFile: file.boardsPerFile,
      multiColor: file.multiColor,
      fixedColor: canonicalColour(file.fixedColor),
      runDriver: file.runDriver,
    })),
  );

  return { requirements, cncRuns };
}
