import { calculateProductionPlan, type Requirement } from "@/lib/domain/productionCalculations";
import type { CncProductionRecommendation } from "@/lib/domain/cncCalculations";
import { getBom } from "./bom";
import { getInventory } from "./inventory";
import { getOrders } from "./orders";
import { getCNCFiles, getParts } from "./parts";

export type ProductionColour = {
  colour: string;
  required: number;
  inStock: number;
  toCut: number;
  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
  partsPerFullRun: number;
  expectedOutput: number;
  expectedSurplus: number;
};

export type ProductionGroup = {
  part: string;
  totalToCut: number;
  totalBoards: number;
  cncFile: string;
  colours: ProductionColour[];
};

export type ProductionMachine = {
  machine: string;
  parts: ProductionGroup[];
  cncRuns: CncProductionRecommendation[];
};

function toProductionColour(requirement: Requirement, recommendations: CncProductionRecommendation[]): ProductionColour {
  const cnc = requirement.cnc;
  const plannedOutputs = recommendations.flatMap((run) => run.outputs
    .filter((output) => output.partName === requirement.part && output.color === requirement.color));
  const expectedOutput = plannedOutputs.reduce((sum, output) => sum + output.expectedOutput, 0);
  return {
    colour: requirement.color,
    required: requirement.required,
    inStock: requirement.inStock,
    toCut: requirement.shortage,
    cncFile: requirement.cncFile ?? "",
    partsPerBoard: cnc?.qtyPerBoard ?? 0,
    boardsRequired: plannedOutputs.reduce((sum, output) => sum + output.boardsAllocated, 0),
    partsPerFullRun: cnc?.partsPerFullRun ?? 0,
    expectedOutput,
    expectedSurplus: Math.max(expectedOutput - requirement.shortage, 0),
  };
}

export async function getProduction(): Promise<ProductionMachine[]> {
  const [orders, bom, inventory, parts, cncFiles] = await Promise.all([
    getOrders(),
    getBom(),
    getInventory(),
    getParts(),
    getCNCFiles(),
  ]);

  const plan = calculateProductionPlan(
    orders.map((order) => ({
      status: order.status as "Waiting" | "Completed",
      items: order.items.map((item) => ({
        item: item.item,
        color: item.color,
        qty: Number(item.qty),
      })),
    })),
    bom,
    inventory,
    parts,
    cncFiles,
  );
  const requirements = plan.requirements;

  const grouped = new Map<string, Map<string, ProductionColour[]>>();
  for (const requirement of requirements) {
    if (requirement.shortage === 0) continue;
    const partGroups = grouped.get(requirement.machine) ?? new Map<string, ProductionColour[]>();
    const colours = partGroups.get(requirement.part) ?? [];
    colours.push(toProductionColour(requirement, plan.cncRuns));
    partGroups.set(requirement.part, colours);
    grouped.set(requirement.machine, partGroups);
  }

  return [...grouped.entries()]
    .map(([machine, partGroups]) => ({
      machine,
      cncRuns: machine === "CNC" ? plan.cncRuns : [],
      parts: [...partGroups.entries()]
        .map(([part, colours]) => ({
          part,
          totalToCut: colours.reduce((sum, colour) => sum + colour.toCut, 0),
          totalBoards: colours.reduce((sum, colour) => sum + colour.boardsRequired, 0),
          cncFile: colours[0]?.cncFile ?? "",
          colours: colours.sort((a, b) => b.toCut - a.toCut),
        }))
        .sort((a, b) => b.totalToCut - a.totalToCut),
    }))
    .sort((a, b) => a.machine.localeCompare(b.machine));
}
