import { NextRequest, NextResponse } from "next/server";
import { deleteOrder } from "@/services/orders";

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json();

    await deleteOrder(body.orderId);

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete order.",
      },
      {
        status: 500,
      }
    );

  }
}