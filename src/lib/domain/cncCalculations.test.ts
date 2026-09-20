import test from "node:test";
import assert from "node:assert/strict";
import { calculateCncRun } from "./cncCalculations.ts";
import { canonicalColour, canonicalPartName } from "./normalization.ts";
import { nonNegativeNumber } from "./sheetParsing.ts";

 test("rounds CNC requirements to complete runs", () => {
  assert.deepEqual(calculateCncRun(79, 6, 13), {
    partsNeeded: 79,
    qtyPerBoard: 6,
    boardsPerFile: 13,
    partsPerFullRun: 78,
    fullRunsNeeded: 2,
    boardsToRun: 26,
    expectedOutput: 156,
    expectedSurplus: 77,
  });
});

test("keeps an exact full run at one run", () => {
  assert.equal(calculateCncRun(78, 6, 13).fullRunsNeeded, 1);
  assert.equal(calculateCncRun(78, 6, 13).expectedSurplus, 0);
});

test("canonicalizes approved legacy values", () => {
  assert.equal(canonicalColour("Cherry"), "Cherrywood");
  assert.equal(canonicalColour(" Cherrywood "), "Cherrywood");
  assert.equal(canonicalPartName("A‑frame"), "A-frame");
  assert.equal(canonicalPartName("Aframe"), "A-frame");
});

test("rejects invalid CNC capacities", () => {
  assert.throws(() => calculateCncRun(10, 0, 13), /QtyPerBoard/);
  assert.throws(() => calculateCncRun(10, 6, 0), /BoardsPerFile/);
});

test("reports blank numeric cells as unknown instead of zero", () => {
  assert.throws(
    () => nonNegativeNumber("Shop Parts Inventory", 42, "In Stock", ""),
    /Shop Parts Inventory row 42, In Stock: value is unknown because the cell is blank/,
  );
});
