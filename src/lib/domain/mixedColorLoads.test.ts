import test from "node:test";
import assert from "node:assert/strict";
import { calculateGroupedCncRuns } from "./cncCalculations.ts";
import { calculateProductionPlan } from "./productionCalculations.ts";

const file = { fileName: "5x12 Luxe Arms", partName: "Luxe Arm", qtyPerBoard: 7, boardsPerFile: 9, multiColor: true, fixedColor: "", runDriver: true };
function plan(shortages: number[]) {
  return calculateGroupedCncRuns(shortages.map((shortage, i) => ({ part: file.partName, color: ["Toffee", "Granite", "Marble"][i], shortage })), [file])[0];
}

test("three colours share one partial load with board-based output and surplus", () => {
  const result = plan([4, 4, 4]);
  assert.deepEqual(result.boardAllocations, [{ color: "Toffee", boards: 1 }, { color: "Granite", boards: 1 }, { color: "Marble", boards: 1 }]);
  assert.deepEqual([result.loadCount, result.fullLoadCount, result.partialLoadBoards, result.totalPhysicalBoards], [1, 0, 3, 3]);
  assert.equal(result.completeRunsRequired, 0);
  assert.deepEqual(result.outputs.map((o) => [o.expectedOutput, o.expectedSurplus]), [[7, 3], [7, 3], [7, 3]]);
});

test("rounds each colour independently before packing, excludes satisfied colours", () => {
  assert.equal(plan([1, 1, 1]).totalPhysicalBoards, 3);
  assert.deepEqual(plan([8, 0, 1]).boardAllocations, [{ color: "Toffee", boards: 2 }, { color: "Marble", boards: 1 }]);
  assert.equal(plan([0, 0, 0]), undefined);
});

test("twenty boards require two full loads and a final two-board partial load", () => {
  const result = plan([70, 63, 7]);
  assert.deepEqual([result.totalPhysicalBoards, result.loadCount, result.fullLoadCount, result.partialLoadBoards], [20, 3, 2, 2]);
  assert.deepEqual(result.outputs.map((o) => o.expectedOutput), [70, 63, 7]);
});

test("exact load multiples have no partial load", () => {
  const result = plan([63, 63, 0]);
  assert.deepEqual([result.loadCount, result.fullLoadCount, result.partialLoadBoards], [2, 2, 0]);
});

test("all standalone multi-colour definitions use board packing regardless of file name", () => {
  for (const fileName of ["Front Slat Logo", "5x12 Luxe Table Top", "5x12 Sapphire Table Top", "5x12 Sapphire Arms", "5x12 Sapphire Back", "Another file"]) {
    const result = calculateGroupedCncRuns([{ part: "P", color: "Toffee", shortage: 1 }, { part: "P", color: "Granite", shortage: 1 }], [{ ...file, fileName, partName: "P", qtyPerBoard: 1, boardsPerFile: 8 }])[0];
    assert.equal(result.totalPhysicalBoards, 2);
    assert.equal(result.loadCount, 1);
    assert.equal(result.partialLoadBoards, 2);
  }
});

test("fixed-colour files still round to complete loads", () => {
  const result = calculateGroupedCncRuns([{ part: file.partName, color: "Black", shortage: 4 }], [{ ...file, multiColor: false, fixedColor: "Black" }])[0];
  assert.equal(result.totalPhysicalBoards, 9);
  assert.equal(result.fullLoadCount, 1);
  assert.equal(result.partialLoadBoards, 0);
  assert.equal(result.outputs[0].expectedOutput, 63);
});

test("production subtracts inventory and never mutates input while packing colours", () => {
  const inventory = [{ part: file.partName, colour: "Toffee", quantity: 7 }, { part: file.partName, colour: "Granite", quantity: 0 }];
  const before = structuredClone(inventory);
  const result = calculateProductionPlan(
    [{ status: "Waiting", items: [{ item: "Chair", color: "Toffee", qty: 8 }, { item: "Chair", color: "Granite", qty: 1 }] }],
    [{ product: "Chair", part: file.partName, qtyPerUnit: 1 }], inventory,
    [{ name: file.partName, primaryMachine: "CNC", fixedColor: "", cncFile: file.fileName }], [file],
  );
  assert.equal(result.cncRuns[0].totalPhysicalBoards, 2);
  assert.equal(result.cncRuns[0].loadCount, 1);
  assert.deepEqual(result.requirements.map((r) => r.cnc?.expectedOutput), [7, 7]);
  assert.deepEqual(inventory, before);
});
