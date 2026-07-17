import { NextResponse } from "next/server";
import { getActiveEmployees } from "@/services/employees";

export async function GET() {
  try {
    const employees = await getActiveEmployees();

    return NextResponse.json(employees);
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