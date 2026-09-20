import test from "node:test";
import assert from "node:assert/strict";
import { calculateGroupedCncRuns } from "./cncCalculations.ts";
import { calculateProduction, calculateProductionPlan } from "./productionCalculations.ts";

test("expands waiting demand and excludes completed orders", () => {
  const result = calculateProduction(
    [
      { status: "Waiting", items: [{ item: "Chair", color: "Cherry", qty: 2 }] },
      { status: "Completed", items: [{ item: "Chair", color: "Cherry", qty: 100 }] },
    ],
    [{ product: "Chair", part: "A‑frame", qtyPerUnit: 3 }],
    [{ part: "A-frame", colour: "Cherrywood", quantity: 1 }],
    [{ name: "A-frame", fixedColor: "", primaryMachine: "Chop Saw" }],
    [],
  );

  assert.deepEqual(result[0], {
    part: "A-frame",
    color: "Cherrywood",
    required: 6,
    inStock: 1,
    shortage: 5,
    machine: "Chop Saw",
    cnc: undefined,
    cncFile: undefined,
  });
});

test("rejects an inventory combination with no row", () => {
  assert.throws(
    () => calculateProduction(
      [{ status: "Waiting", items: [{ item: "Chair", color: "Cherry", qty: 1 }] }],
      [{ product: "Chair", part: "A-frame", qtyPerUnit: 1 }],
      [],
      [{ name: "A-frame", fixedColor: "", primaryMachine: "Chop Saw" }],
      [],
    ),
    /Inventory row is missing for A-frame \(Cherrywood\)/,
  );
});

const cncPart = {
  name: "Ottoman Front Slat",
  primaryMachine: "CNC",
  fixedColor: "",
  cncFile: "Ottoman Front Slat.nc",
};

const cncBom = [{ product: "Gliding Ottoman", part: "Ottoman Front Slat", qtyPerUnit: 2 }];
const cncInventory = [{ part: "Ottoman Front Slat", colour: "Cherrywood", quantity: 0 }];
const validCncFile = {
  fileName: "Ottoman Front Slat.nc",
  partName: "Ottoman Front Slat",
  qtyPerBoard: 6,
  boardsPerFile: 13,
  multiColor: true,
  fixedColor: "",
  runDriver: true,
};

test("rejects a CNC part with no CNC Files mapping", () => {
  assert.throws(
    () => calculateProduction(
      [{ status: "Waiting", items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }] }],
      cncBom,
      cncInventory,
      [cncPart],
      [],
    ),
    /CNC mapping is missing for CNC part Ottoman Front Slat/,
  );
});

test("a blank Parts CNC File cannot hide a missing CNC Files mapping", () => {
  assert.throws(
    () => calculateProduction(
      [{ status: "Waiting", items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }] }],
      cncBom,
      cncInventory,
      [{ ...cncPart, cncFile: "" }],
      [],
    ),
    /CNC metadata is invalid for Ottoman Front Slat: Parts\.CNC File is blank/,
  );
});

test("does not require a CNC mapping for a non-CNC part", () => {
  const result = calculateProduction(
    [{ status: "Waiting", items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }] }],
    cncBom,
    cncInventory,
    [{ name: "Ottoman Front Slat", primaryMachine: "Chop Saw", fixedColor: "", cncFile: "" }],
    [],
  );

  assert.equal(result[0].shortage, 2);
});

test("accepts a CNC part with a complete authoritative mapping", () => {
  const result = calculateProduction(
    [{ status: "Waiting", items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }] }],
    cncBom,
    cncInventory,
    [cncPart],
    [validCncFile],
  );

  assert.equal(result[0].cnc?.partsPerFullRun, 78);
  assert.equal(result[0].cnc?.fullRunsNeeded, 1);
});

test("retains separate CNC rows that share one FileName", () => {
  const sharedFileName = "Gliding Ottoman";
  const result = calculateProduction(
    [{
      status: "Waiting",
      items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }],
    }],
    [
      { product: "Gliding Ottoman", part: "Ottoman Front Slat", qtyPerUnit: 7 },
      { product: "Gliding Ottoman", part: "Ottoman Base Top", qtyPerUnit: 5 },
      { product: "Gliding Ottoman", part: "Ottoman Side", qtyPerUnit: 21 },
    ],
    [
      { part: "Ottoman Front Slat", colour: "Cherrywood", quantity: 0 },
      { part: "Ottoman Base Top", colour: "Black", quantity: 0 },
      { part: "Ottoman Side", colour: "Black", quantity: 0 },
    ],
    [
      { name: "Ottoman Front Slat", primaryMachine: "CNC", fixedColor: "", cncFile: sharedFileName },
      { name: "Ottoman Base Top", primaryMachine: "CNC", fixedColor: "", cncFile: sharedFileName },
      { name: "Ottoman Side", primaryMachine: "CNC", fixedColor: "", cncFile: sharedFileName },
    ],
    [
      { fileName: sharedFileName, partName: "Ottoman Front Slat", qtyPerBoard: 2, boardsPerFile: 3, multiColor: true, fixedColor: "", runDriver: true },
      { fileName: sharedFileName, partName: "Ottoman Base Top", qtyPerBoard: 3, boardsPerFile: 2, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: sharedFileName, partName: "Ottoman Side", qtyPerBoard: 4, boardsPerFile: 5, multiColor: false, fixedColor: "Black", runDriver: true },
    ],
  );

  assert.deepEqual(result.map((requirement) => ({
    part: requirement.part,
    color: requirement.color,
    partsPerFullRun: requirement.cnc?.partsPerFullRun,
    fullRunsNeeded: requirement.cnc?.fullRunsNeeded,
    boardsToRun: requirement.cnc?.boardsToRun,
    expectedOutput: requirement.cnc?.expectedOutput,
    expectedSurplus: requirement.cnc?.expectedSurplus,
  })), [
    { part: "Ottoman Front Slat", color: "Cherrywood", partsPerFullRun: 6, fullRunsNeeded: 2, boardsToRun: 6, expectedOutput: 12, expectedSurplus: 5 },
    { part: "Ottoman Base Top", color: "Black", partsPerFullRun: 6, fullRunsNeeded: 1, boardsToRun: 2, expectedOutput: 6, expectedSurplus: 1 },
    { part: "Ottoman Side", color: "Black", partsPerFullRun: 20, fullRunsNeeded: 2, boardsToRun: 10, expectedOutput: 40, expectedSurplus: 19 },
  ]);
});

test("plans one four-board grouped run with four independent outputs", () => {
  const recommendation = calculateGroupedCncRuns(
    [
      { part: "Ottoman Front Slat", color: "Cherrywood", shortage: 4 },
      { part: "Ottoman Base Top", color: "Black", shortage: 4 },
      { part: "Ottoman Side", color: "Black", shortage: 4 },
      { part: "Ottoman Leg", color: "Cherrywood", shortage: 8 },
    ],
    [
      { fileName: "Gliding Ottoman", partName: "Ottoman Front Slat", qtyPerBoard: 4, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Base Top", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Side", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Leg", qtyPerBoard: 8, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
    ],
  )[0];

  assert.equal(recommendation.completeRunsRequired, 1);
  assert.equal(recommendation.totalBoardsPerRun, 4);
  assert.equal(recommendation.customerColorBoardsPerRun, 2);
  assert.equal(recommendation.fixedColorBoardsPerRun, 2);
  assert.equal(recommendation.outputs.length, 4);
  assert.deepEqual(
    recommendation.outputs.map((output) => [output.partName, output.color, output.partsPerRun, output.expectedOutput, output.expectedSurplus]).sort(),
    [
      ["Ottoman Front Slat", "Cherrywood", 4, 4, 0],
      ["Ottoman Leg", "Cherrywood", 8, 8, 0],
      ["Ottoman Base Top", "Black", 4, 4, 0],
      ["Ottoman Side", "Black", 4, 4, 0],
    ].sort(),
  );
});

test("uses the largest unmet customer-color output requirement per color", () => {
  const recommendation = calculateGroupedCncRuns(
    [
      { part: "Ottoman Front Slat", color: "Cherrywood", shortage: 5 },
      { part: "Ottoman Leg", color: "Cherrywood", shortage: 8 },
      { part: "Ottoman Front Slat", color: "Granite", shortage: 9 },
      { part: "Ottoman Leg", color: "Granite", shortage: 1 },
      { part: "Ottoman Base Top", color: "Black", shortage: 0 },
    ],
    [
      { fileName: "Gliding Ottoman", partName: "Ottoman Front Slat", qtyPerBoard: 4, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Base Top", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Leg", qtyPerBoard: 8, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
    ],
  )[0];

  assert.deepEqual(recommendation.colorRuns.map((run) => [run.color, run.completeRunsRequired]), [["Cherrywood", 2], ["Granite", 3]]);
  assert.equal(recommendation.completeRunsRequired, 5);
  assert.equal(recommendation.totalBoardsPerRun, 3);
});

test("counts fixed output once and requests manual color for extra fixed runs", () => {
  const recommendation = calculateGroupedCncRuns(
    [
      { part: "Ottoman Front Slat", color: "Cherrywood", shortage: 1 },
      { part: "Ottoman Leg", color: "Cherrywood", shortage: 1 },
      { part: "Ottoman Base Top", color: "Black", shortage: 5 },
    ],
    [
      { fileName: "Gliding Ottoman", partName: "Ottoman Front Slat", qtyPerBoard: 4, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Base Top", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Leg", qtyPerBoard: 8, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
    ],
  )[0];

  assert.equal(recommendation.completeRunsRequired, 2);
  assert.equal(recommendation.manualCustomerColorRunsRequired, 1);
  assert.match(recommendation.validationErrors[0], /select a customer color manually/);
  const fixedOutput = recommendation.outputs.find((output) => output.partName === "Ottoman Base Top");
  assert.deepEqual(fixedOutput && [fixedOutput.expectedOutput, fixedOutput.expectedSurplus], [8, 3]);
});

test("production plan exposes one grouped recommendation for a shared file", () => {
  const plan = calculateProductionPlan(
    [{ status: "Waiting", items: [{ item: "Gliding Ottoman", color: "Cherrywood", qty: 1 }] }],
    [
      { product: "Gliding Ottoman", part: "Ottoman Front Slat", qtyPerUnit: 2 },
      { product: "Gliding Ottoman", part: "Ottoman Base Top", qtyPerUnit: 2 },
      { product: "Gliding Ottoman", part: "Ottoman Side", qtyPerUnit: 2 },
      { product: "Gliding Ottoman", part: "Ottoman Leg", qtyPerUnit: 4 },
    ],
    [
      { part: "Ottoman Front Slat", colour: "Cherrywood", quantity: 0 },
      { part: "Ottoman Base Top", colour: "Black", quantity: 0 },
      { part: "Ottoman Side", colour: "Black", quantity: 0 },
      { part: "Ottoman Leg", colour: "Cherrywood", quantity: 0 },
    ],
    [
      { name: "Ottoman Front Slat", primaryMachine: "CNC", fixedColor: "", cncFile: "Gliding Ottoman" },
      { name: "Ottoman Base Top", primaryMachine: "CNC", fixedColor: "", cncFile: "Gliding Ottoman" },
      { name: "Ottoman Side", primaryMachine: "CNC", fixedColor: "", cncFile: "Gliding Ottoman" },
      { name: "Ottoman Leg", primaryMachine: "CNC", fixedColor: "", cncFile: "Gliding Ottoman" },
    ],
    [
      { fileName: "Gliding Ottoman", partName: "Ottoman Front Slat", qtyPerBoard: 4, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Base Top", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Side", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Gliding Ottoman", partName: "Ottoman Leg", qtyPerBoard: 8, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
    ],
  );

  assert.equal(plan.cncRuns.length, 1);
  assert.equal(plan.cncRuns[0].totalBoardsPerRun, 4);
  assert.equal(plan.cncRuns[0].outputs.length, 4);
});

test("schedules a shared driver file, credits byproducts, then uses fallback shortage", () => {
  const recommendations = calculateGroupedCncRuns(
    [
      { part: "Base Bottoms", color: "Black", shortage: 13 },
      { part: "Table Uprights", color: "Black", shortage: 10 },
    ],
    [
      { fileName: "Fixture Shared File", partName: "Base Bottoms", qtyPerBoard: 1, boardsPerFile: 13, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Fixture Shared File", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: false },
      { fileName: "5x12 Table Uprights", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: true },
    ],
  );

  assert.deepEqual(recommendations.map((recommendation) => recommendation.fileName), ["Fixture Shared File", "5x12 Table Uprights"]);
  assert.equal(recommendations[0].completeRunsRequired, 1);
  assert.equal(recommendations[0].outputs.find((output) => output.partName === "Table Uprights")?.runDriver, false);
  assert.equal(recommendations[0].outputs.find((output) => output.partName === "Table Uprights")?.quantityCredited, 9);
  assert.equal(recommendations[1].completeRunsRequired, 1);
  assert.equal(recommendations[1].outputs.find((output) => output.partName === "Table Uprights")?.partsNeeded, 1);
  assert.equal(recommendations[1].outputs[0].quantityCredited, 1);
});

test("a byproduct shortage alone does not schedule its shared file", () => {
  const recommendations = calculateGroupedCncRuns(
    [{ part: "Table Uprights", color: "Black", shortage: 10 }],
    [
      { fileName: "Fixture Shared File", partName: "Base Bottoms", qtyPerBoard: 1, boardsPerFile: 13, multiColor: false, fixedColor: "Black", runDriver: true },
      { fileName: "Fixture Shared File", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: false },
      { fileName: "5x12 Table Uprights", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: true },
    ],
  );

  assert.deepEqual(recommendations.map((recommendation) => recommendation.fileName), ["5x12 Table Uprights"]);
});

test("rejects ambiguous driver routes", () => {
  assert.throws(
    () => calculateGroupedCncRuns(
      [{ part: "Table Uprights", color: "Black", shortage: 1 }],
      [
        { fileName: "A", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
        { fileName: "B", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: true },
      ],
    ),
    /Ambiguous CNC driver routes for Table Uprights/,
  );
});

const baseOutputs = [
  { fileName: "5x12 Base Bottom", partName: "Base Bottoms", qtyPerBoard: 4, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: true },
  { fileName: "5x12 Base Bottom", partName: "Table Uprights", qtyPerBoard: 2, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: false },
  { fileName: "5x12 Table Uprights", partName: "Table Uprights", qtyPerBoard: 1, boardsPerFile: 9, multiColor: false, fixedColor: "Black", runDriver: true },
];

function basePlan(files = baseOutputs, stock = 0, quantity = 6) {
  const inventory = [
    { part: "Base Bottoms", colour: "Black", quantity: stock },
    { part: "Table Uprights", colour: "Black", quantity: stock },
  ];
  const before = structuredClone(inventory);
  const plan = calculateProductionPlan(
    [{ status: "Waiting", items: [{ item: "Fixture", color: "Cherrywood", qty: quantity }] }],
    inventory.map((i) => ({ product: "Fixture", part: i.part, qtyPerUnit: 1 })),
    inventory,
    inventory.map((i) => ({ name: i.part, primaryMachine: "CNC", fixedColor: "Black", cncFile: files.find((f) => f.partName === i.part && f.runDriver)?.fileName ?? "" })),
    files,
  );
  assert.deepEqual(inventory, before, "expected output must not mutate inventory");
  return plan;
}

test("Base Bottom plan credits both outputs and eliminates the fallback run", () => {
  const plan = basePlan();
  assert.deepEqual(plan.cncRuns.map((r) => [r.fileName, r.completeRunsRequired]), [["5x12 Base Bottom", 1]]);
  assert.deepEqual(plan.cncRuns[0].outputs.map((o) => [o.partName, o.expectedOutput, o.quantityCredited, o.expectedSurplus]), [
    ["Base Bottoms", 36, 6, 30], ["Table Uprights", 18, 6, 12],
  ]);
  assert.deepEqual(plan.cncRuns[0].validationErrors, []);
});

test("one shared nine-board run produces 36 bottoms and 18 uprights", () => {
  const plan = basePlan();
  assert.equal(plan.cncRuns[0].totalBoardsPerRun, 9);
  assert.equal(plan.cncRuns[0].fixedColorBoardsPerRun, 9);
  assert.equal(plan.cncRuns[0].customerColorBoardsPerRun, 0);
  assert.deepEqual(plan.cncRuns.map((r) => [r.fileName, r.completeRunsRequired]), [["5x12 Base Bottom", 1]]);
  assert.deepEqual(plan.cncRuns[0].outputs.map((o) => [o.expectedOutput, o.quantityCredited, o.expectedSurplus]), [[36, 6, 30], [18, 6, 12]]);
});

test("subtracts stock before shared and fallback runs, independent of Sheet row order", () => {
  const plan = basePlan([...baseOutputs].reverse(), 7, 44);
  assert.deepEqual(plan.requirements.map((r) => r.shortage), [37, 37]);
  assert.deepEqual(plan.cncRuns.map((r) => [r.fileName, r.completeRunsRequired]), [["5x12 Base Bottom", 2], ["5x12 Table Uprights", 1]]);
  assert.equal(plan.cncRuns[1].outputs[0].partsNeeded, 1);
  assert.equal(plan.cncRuns[1].outputs[0].expectedSurplus, 8);
  assert.deepEqual(basePlan(baseOutputs, 20, 20).cncRuns, []);
  assert.deepEqual(basePlan(baseOutputs, 21, 20).cncRuns, []);
});

test("supports two driver outputs in one file using the maximum run count, not their sum", () => {
  const sharedOnly = baseOutputs.slice(0, 2).map((f) => ({ ...f, runDriver: true }));
  const plan = basePlan(sharedOnly, 0, 19);
  assert.equal(plan.cncRuns.length, 1);
  assert.equal(plan.cncRuns[0].completeRunsRequired, 2);
  assert.deepEqual(plan.cncRuns[0].outputs.map((o) => o.expectedOutput), [72, 36]);
});

test("production rejects ambiguous routes, duplicate rows, invalid byproduct capacity and inconsistent colors", () => {
  assert.throws(() => basePlan(baseOutputs.map((f) => ({ ...f, runDriver: true }))), /Duplicate CNC mappings/);
  assert.throws(() => basePlan([...baseOutputs, baseOutputs[1]]), /Duplicate CNC mappings/);
  assert.throws(() => basePlan(baseOutputs.map((f, i) => i === 1 ? { ...f, qtyPerBoard: 0 } : f)), /QtyPerBoard must be positive/);
  assert.throws(() => basePlan(baseOutputs.map((f, i) => i === 1 ? { ...f, fixedColor: "Granite" } : f)), /Inconsistent CNC output colors/);
});

test("shared-board nesting rejects mismatched board counts and missing or extra outputs", () => {
  assert.throws(() => basePlan(baseOutputs.map((f, i) => i === 0 ? { ...f, boardsPerFile: 13 } : f)), /requires matching positive board counts/);
  assert.throws(() => calculateGroupedCncRuns([], [baseOutputs[0]]), /requires exactly Base Bottoms and Table Uprights/);
  assert.throws(() => calculateGroupedCncRuns([], [...baseOutputs, { ...baseOutputs[1], partName: "Unexpected output" }]), /requires exactly Base Bottoms and Table Uprights/);
});

test("live Ottoman driver/byproducts retain four separate boards despite equal board counts", () => {
  const outputs = [
    { fileName: "Gliding Ottoman", partName: "Ottoman Front Slat", qtyPerBoard: 4, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: false },
    { fileName: "Gliding Ottoman", partName: "Ottoman Base Top", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: false },
    { fileName: "Gliding Ottoman", partName: "Ottoman Side", qtyPerBoard: 4, boardsPerFile: 1, multiColor: false, fixedColor: "Black", runDriver: false },
    { fileName: "Gliding Ottoman", partName: "Ottoman Leg", qtyPerBoard: 8, boardsPerFile: 1, multiColor: true, fixedColor: "", runDriver: true },
  ];
  const runs = calculateGroupedCncRuns([{ part: "Ottoman Leg", color: "Cherrywood", shortage: 8 }], outputs);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].completeRunsRequired, 1);
  assert.equal(runs[0].totalBoardsPerRun, 4);
  assert.equal(runs[0].customerColorBoardsPerRun, 2);
  assert.equal(runs[0].fixedColorBoardsPerRun, 2);
  assert.deepEqual(runs[0].outputs.map((o) => o.expectedOutput), [4, 4, 4, 8]);
});
