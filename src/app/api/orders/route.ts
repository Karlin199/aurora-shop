import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";

export async function GET() {
  try {
    const rows = await getSheetValues("Orders");

    if (rows.length <= 1) {
      return NextResponse.json([]);
    }

    const grouped = new Map();

    for (const row of rows.slice(1)) {
      const status = row[5] ?? "";

      if (status === "Completed") continue;

      const customer = row[0] ?? "";
      const dueDate = row[4] ?? "";

      const key = `${customer}|${dueDate}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          customer,
          dueDate,
          status,
          items: [],
        });
      }

      grouped.get(key).items.push({
        item: row[1] ?? "",
        color: row[2] ?? "",
        qty: row[3] ?? "",
      });
    }

    return NextResponse.json([...grouped.values()]);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Unable to load orders." },
      { status: 500 }
    );
  }
}