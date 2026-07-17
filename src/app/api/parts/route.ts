import { NextResponse } from "next/server";
import { getInventory } from "@/services/inventory";

export async function GET() {
  try {
    const inventory = await getInventory();

    const parts = inventory.map((item) => ({
      part: item.part,
      colour: item.colour,
    }));

    return NextResponse.json(parts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}