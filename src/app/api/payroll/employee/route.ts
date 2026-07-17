import { NextRequest, NextResponse } from "next/server";
import { getEmployeeEntries } from "@/services/payroll";

export async function GET(request: NextRequest) {
  try {
    const employee =
      request.nextUrl.searchParams.get("employee");

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

    const entries =
      await getEmployeeEntries(employee);

    return NextResponse.json(entries);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load employee entries.",
      },
      {
        status: 500,
      }
    );
  }
}