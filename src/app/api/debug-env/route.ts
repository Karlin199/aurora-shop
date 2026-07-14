import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasProjectId: !!process.env.GOOGLE_PROJECT_ID,
    hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    privateKeyStartsWith:
      process.env.GOOGLE_PRIVATE_KEY?.substring(0, 30),
    privateKeyEndsWith:
      process.env.GOOGLE_PRIVATE_KEY?.slice(-30),
  });
}