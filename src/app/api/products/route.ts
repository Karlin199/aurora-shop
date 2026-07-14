import { NextResponse } from "next/server";
import { getProducts } from "@/services/lookups";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load products." },
      { status: 500 }
    );
  }
}