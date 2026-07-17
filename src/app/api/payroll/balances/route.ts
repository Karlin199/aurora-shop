import { NextResponse } from "next/server";
import { getEmployeeBalances } from "@/services/payroll";

export async function GET() {
  try {
    const balances = await getEmployeeBalances();

    return NextResponse.json(balances);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load payroll balances.",
      },
      {
        status: 500,
      }
    );
  }
}