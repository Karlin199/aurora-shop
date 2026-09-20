import test from "node:test";
import assert from "node:assert/strict";
import { isProductionActiveOrderRow } from "./orderParsing.ts";

test("excludes completed history before requiring an order identity", () => {
  assert.equal(isProductionActiveOrderRow(["", "", "", "", "", "", "Completed"], 2), false);
  assert.equal(isProductionActiveOrderRow(["fixture", "", "", "", "", "", "Waiting"], 3), true);
});

test("still rejects missing active order identities and unknown or blank statuses", () => {
  assert.throws(() => isProductionActiveOrderRow(["", "", "", "", "", "", "Waiting"], 2), /Order ID/);
  assert.throws(() => isProductionActiveOrderRow(["", "", "", "", "", "", "Unknown"], 2), /unknown status/);
  assert.throws(() => isProductionActiveOrderRow([], 2), /Status: value is required/);
});
