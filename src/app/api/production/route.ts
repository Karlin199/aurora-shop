import { NextResponse } from "next/server";
import { getProduction } from "@/services/production";
import { SheetValidationError } from "@/lib/domain/sheetParsing";

export async function GET() {
  try {
    const production = await getProduction();

    return NextResponse.json(production);

  } catch (error) {

    console.error(error);

    if (error instanceof SheetValidationError) {
      return NextResponse.json(
        { error: error.message, sheet: error.sheet, row: error.row, field: error.field },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load production.",
      },
      {
        status: 500,
      }
    );

  }
}