import { NextRequest, NextResponse } from "next/server";
import { payEmployee } from "@/services/payroll";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { employee } = body;

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee is required.",
        },
        {
          status: 400,
        }
      );
    }

    await payEmployee(employee);

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
            : "Unable to pay employee.",
      },
      {
        status: 500,
      }
    );
  }
}