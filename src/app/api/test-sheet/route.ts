import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/googleSheets";

export async function GET() {
  try {
    const rows = await getSheetValues("Orders");

    return NextResponse.json({
      success: true,
      rowCount: rows.length,
      firstFiveRows: rows.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}