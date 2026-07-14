import { NextResponse } from "next/server";
import { getCustomers } from "@/services/lookups";

export async function GET() {
  try {
    return NextResponse.json(await getCustomers());
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load customers." },
      { status: 500 }
    );
  }
}