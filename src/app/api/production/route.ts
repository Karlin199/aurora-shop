import { NextResponse } from "next/server";
import { getProduction } from "@/services/production";

export async function GET() {
  try {
    const production = await getProduction();

    return NextResponse.json(production);

  } catch (error) {

    console.error(error);

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