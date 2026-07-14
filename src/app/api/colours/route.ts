import { NextResponse } from "next/server";
import { getColours } from "@/services/lookups";

export async function GET() {
  try {
    return NextResponse.json(await getColours());
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load colours." },
      { status: 500 }
    );
  }
}