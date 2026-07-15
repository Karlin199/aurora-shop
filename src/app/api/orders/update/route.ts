import { NextRequest, NextResponse } from "next/server";
import { updateOrder } from "@/services/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await updateOrder(
      body.originalOrderId,
      body.customer,
      body.dueDate,
      body.products
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update order.",
      },
      {
        status: 500,
      }
    );
  }
}