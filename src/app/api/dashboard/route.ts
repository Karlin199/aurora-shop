import { NextResponse } from "next/server";
import { getDashboardData } from "@/services/dashboard";

export async function GET() {
  try {
    const dashboard = await getDashboardData();

    return NextResponse.json(dashboard);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Unable to load dashboard." },
      { status: 500 }
    );
  }
}