export type CncRunPlan = {
  partsNeeded: number;
  qtyPerBoard: number;
  boardsPerFile: number;
  partsPerFullRun: number;
  fullRunsNeeded: number;
  boardsToRun: number;
  expectedOutput: number;
  expectedSurplus: number;
};

export type CncOutputDefinition = {
  fileName: string;
  partName: string;
  qtyPerBoard: number;
  boardsPerFile: number;
  multiColor: boolean;
  fixedColor: string;
  runDriver: boolean;
};

export type CncRunOutput = {
  partName: string;
  color: string;
  runDriver: boolean;
  partsNeeded: number;
  partsPerRun: number;
  quantityProduced: number;
  quantityCredited: number;
  expectedOutput: number;
  expectedSurplus: number;
};

export type CncColorRun = {
  color: string;
  completeRunsRequired: number;
  outputs: CncRunOutput[];
};

export type CncProductionRecommendation = {
  fileName: string;
  completeRunsRequired: number;
  totalBoardsPerRun: number;
  customerColorBoardsPerRun: number;
  fixedColorBoardsPerRun: number;
  colorRuns: CncColorRun[];
  outputs: CncRunOutput[];
  manualCustomerColorRunsRequired: number;
  validationErrors: string[];
};

export function calculateCncRun(partsNeeded: number, qtyPerBoard: number, boardsPerFile: number): CncRunPlan {
  if (!Number.isFinite(partsNeeded) || partsNeeded < 0) {
    throw new Error("Parts needed must be a non-negative finite number.");
  }
  if (!Number.isFinite(qtyPerBoard) || qtyPerBoard <= 0) {
    throw new Error("QtyPerBoard must be a positive finite number.");
  }
  if (!Number.isFinite(boardsPerFile) || boardsPerFile <= 0) {
    throw new Error("BoardsPerFile must be a positive finite number.");
  }

  const partsPerFullRun = qtyPerBoard * boardsPerFile;
  const fullRunsNeeded = Math.ceil(partsNeeded / partsPerFullRun);
  const boardsToRun = fullRunsNeeded * boardsPerFile;
  const expectedOutput = fullRunsNeeded * partsPerFullRun;

  return {
    partsNeeded,
    qtyPerBoard,
    boardsPerFile,
    partsPerFullRun,
    fullRunsNeeded,
    boardsToRun,
    expectedOutput,
    expectedSurplus: expectedOutput - partsNeeded,
  };
}

export function groupCncOutputs(outputs: CncOutputDefinition[]): Map<string, CncOutputDefinition[]> {
  const grouped = new Map<string, CncOutputDefinition[]>();

  for (const output of outputs) {
    const current = grouped.get(output.fileName) ?? [];
    if (current.some((candidate) => candidate.partName === output.partName)) {
      throw new Error(`Duplicate CNC part mapping: ${output.fileName} / ${output.partName}`);
    }
    current.push(output);
    grouped.set(output.fileName, current);
  }

  return grouped;
}

function partsPerRun(output: CncOutputDefinition): number {
  return output.qtyPerBoard * output.boardsPerFile;
}

function physicalBoardAllocations(fileName: string, outputs: CncOutputDefinition[]): CncOutputDefinition[] {
  // Owner-confirmed nesting: these two outputs share the same physical boards.
  // RunDriver controls scheduling, not nesting (Ottoman byproducts use separate boards).
  // Keep this explicit until the Sheet has approved board-allocation metadata.
  if (fileName !== "5x12 Base Bottom") return outputs;
  const bottoms = outputs.find((output) => output.partName === "Base Bottoms");
  const uprights = outputs.find((output) => output.partName === "Table Uprights");
  if (outputs.length !== 2 || !bottoms || !uprights) {
    throw new Error("CNC shared-board definition for 5x12 Base Bottom requires exactly Base Bottoms and Table Uprights");
  }
  if (!Number.isInteger(bottoms.boardsPerFile) || bottoms.boardsPerFile <= 0 || bottoms.boardsPerFile !== uprights.boardsPerFile ||
      outputs.some((output) => output.multiColor || output.fixedColor !== "Black")) {
    throw new Error("CNC shared-board definition for 5x12 Base Bottom requires matching positive board counts and fixed Black outputs");
  }
  return [bottoms];
}

export function calculateGroupedCncRuns(
  requirements: { part: string; color: string; shortage: number }[],
  outputs: CncOutputDefinition[],
): CncProductionRecommendation[] {
  const recommendations: CncProductionRecommendation[] = [];

  const driverRoutes = new Map<string, CncOutputDefinition[]>();
  for (const output of outputs) {
    if (!output.runDriver) continue;
    const routes = driverRoutes.get(output.partName) ?? [];
    routes.push(output);
    driverRoutes.set(output.partName, routes);
  }
  for (const [partName, routes] of driverRoutes) {
    if (routes.length > 1) {
      throw new Error(`Ambiguous CNC driver routes for ${partName}`);
    }
  }

  const remaining = new Map(requirements.map((requirement) => [
    `${requirement.part}|${requirement.color}`,
    Math.max(requirement.shortage, 0),
  ]));

  const groups = [...groupCncOutputs(outputs)].sort(([, a], [, b]) => {
    const aShared = a.length > 1 ? 0 : 1;
    const bShared = b.length > 1 ? 0 : 1;
    return aShared - bShared;
  });

  for (const [fileName, fileOutputs] of groups) {
    const boardAllocations = physicalBoardAllocations(fileName, fileOutputs);
    const driverOutputs = fileOutputs.filter((output) => output.runDriver);
    const remainingBeforeFile = new Map(remaining);
    const customerColorOutputs = driverOutputs.filter((output) => output.multiColor);
    const fixedColorOutputs = driverOutputs.filter((output) => !output.multiColor);
    const fixedRunsRequired = Math.max(
      ...fixedColorOutputs.map((output) => Math.ceil(
        (remaining.get(`${output.partName}|${output.fixedColor}`) ?? 0) / partsPerRun(output),
      )),
      0,
    );
    const colors = [...new Set(
      requirements
        .filter((requirement) => customerColorOutputs.some((output) => output.partName === requirement.part))
        .map((requirement) => requirement.color),
    )];
    if (colors.length === 0 && fixedColorOutputs.length > 0) {
      colors.push(fixedColorOutputs[0].fixedColor);
    }
    const colorRuns: CncColorRun[] = [];

    for (const color of colors) {
      const completeRunsRequired = Math.max(
        ...driverOutputs.filter((output) => output.multiColor).map((output) => {
          return Math.ceil((remaining.get(`${output.partName}|${color}`) ?? 0) / partsPerRun(output));
        }),
        ...fixedColorOutputs.filter((output) => output.fixedColor === color).map((output) => {
          return Math.ceil((remaining.get(`${output.partName}|${color}`) ?? 0) / partsPerRun(output));
        }),
        0,
      );
      const colorOutputs = fileOutputs.map((output) => {
        const outputColor = output.multiColor ? color : output.fixedColor;
        const requirement = requirements.find(
          (candidate) => candidate.part === output.partName && candidate.color === outputColor,
        );
        const outputPerRun = partsPerRun(output);
        const expectedOutput = completeRunsRequired * outputPerRun;
        const key = `${output.partName}|${outputColor}`;
        const partsNeeded = remaining.get(key) ?? requirement?.shortage ?? 0;
        const quantityCredited = Math.min(expectedOutput, remaining.get(key) ?? 0);
        remaining.set(key, Math.max((remaining.get(key) ?? 0) - quantityCredited, 0));
        return {
          partName: output.partName,
          color: outputColor,
          runDriver: output.runDriver,
          partsNeeded,
          partsPerRun: outputPerRun,
          quantityProduced: expectedOutput,
          quantityCredited,
          expectedOutput,
          expectedSurplus: expectedOutput - quantityCredited,
        };
      });
      colorRuns.push({ color, completeRunsRequired, outputs: colorOutputs });
    }

    const baseRuns = colorRuns.reduce((sum, run) => sum + run.completeRunsRequired, 0);
    const manualCustomerColorRunsRequired = Math.max(fixedRunsRequired - baseRuns, 0);
    const completeRuns = baseRuns + manualCustomerColorRunsRequired;
    const totalBoardsPerRun = boardAllocations.reduce((sum, output) => sum + output.boardsPerFile, 0);
    const customerColorBoardsPerRun = boardAllocations.filter((output) => output.multiColor).reduce((sum, output) => sum + output.boardsPerFile, 0);
    const fixedColorBoardsPerRun = boardAllocations.filter((output) => !output.multiColor).reduce((sum, output) => sum + output.boardsPerFile, 0);
    const outputs = fileOutputs.flatMap((output) => {
      const outputColorRuns = colorRuns.flatMap((run) => run.outputs.filter((candidate) => candidate.partName === output.partName && candidate.color === (output.multiColor ? run.color : output.fixedColor)));
      if (output.multiColor) return outputColorRuns;

      const key = `${output.partName}|${output.fixedColor}`;
      const produced = completeRuns * partsPerRun(output);
      const required = remainingBeforeFile.get(key) ?? 0;
      const credited = Math.min(produced, required);
      remaining.set(key, Math.max(required - credited, 0));
      return [{
        partName: output.partName,
        color: output.fixedColor,
        runDriver: output.runDriver,
        partsNeeded: required,
        partsPerRun: partsPerRun(output),
        quantityProduced: produced,
        quantityCredited: credited,
        expectedOutput: produced,
        expectedSurplus: produced - credited,
      }];
    });

    if (completeRuns > 0) {
      recommendations.push({
      fileName,
      completeRunsRequired: completeRuns,
      totalBoardsPerRun,
      customerColorBoardsPerRun,
      fixedColorBoardsPerRun,
      colorRuns,
      outputs,
      manualCustomerColorRunsRequired,
      validationErrors: manualCustomerColorRunsRequired > 0
        ? [`${manualCustomerColorRunsRequired} additional run(s) are required for fixed-color output; select a customer color manually.`]
        : [],
      });
    }
  }

  return recommendations;
}
