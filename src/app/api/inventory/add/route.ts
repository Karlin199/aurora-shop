import { NextRequest, NextResponse } from "next/server";
import { addInventory } from "@/services/inventory";

export async function POST(
  request: NextRequest
) {
  try {

    const body = await request.json();

    const {
      part,
      colour,
      quantity,
    } = body;

    if (!part) {
      return NextResponse.json(
        {
          success: false,
          error: "Part is required.",
        },
        { status: 400 }
      );
    }

    if (!colour) {
      return NextResponse.json(
        {
          success: false,
          error: "Colour is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const result = await addInventory(
      part,
      colour,
      quantity
    );

    return NextResponse.json(result);

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