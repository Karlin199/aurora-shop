import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";
import {
  getProductionQueue,
  getDueOrders,
} from "@/services/dashboard";

export async function GET() {
  const rows = await getSheetValues("Orders");
  const data = rows.slice(1);

  const outstandingOrders = data.filter(
    (row) => row[5] !== "Completed"
  ).length;

  return NextResponse.json({
    stats: {
      outstandingOrders,
      partsToCut: 42,
      inventoryAlerts: 5,
      completedThisWeek: 21,
    },
    productionQueue: await getProductionQueue(),
    dueOrders: await getDueOrders(),
  });
}