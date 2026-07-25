import { NextRequest, NextResponse } from "next/server";
import { addInventory } from "@/services/inventory";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { part, cuts } = body;

    if (!part) {
      return NextResponse.json(
        { success: false, error: "Part is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(cuts)) {
      return NextResponse.json(
        { success: false, error: "Cuts are required." },
        { status: 400 }
      );
    }

    for (const cut of cuts) {
      if (cut.quantity > 0) {
        await addInventory(
          part,
          cut.colour,
          cut.quantity
        );
      }
    }

    return NextResponse.json({
      success: true,
    });

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