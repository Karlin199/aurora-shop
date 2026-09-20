import { requiredText, SheetValidationError } from "./sheetParsing.ts";

export const ORDER_STATUSES = ["Waiting", "Completed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isProductionActiveOrderRow(row: string[], sheetRow: number): boolean {
  const status = requiredText("Orders", sheetRow, "Status", row[6]);
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new SheetValidationError("Orders", sheetRow, "Status", `unknown status: ${status}`);
  }
  // Historic completed rows need no identity to be excluded from production.
  if (status === "Completed") return false;
  requiredText("Orders", sheetRow, "Order ID", row[0]);
  return true;
}
