import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/services/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await createOrder(
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
        error: "Unable to create order.",
      },
      {
        status: 500,
      }
    );
  }
}