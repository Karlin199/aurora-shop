import { NextResponse } from "next/server";
import { getPieceJobs } from "@/services/pieceJobs";

export async function GET() {
  try {
    const jobs = await getPieceJobs();

    return NextResponse.json(jobs);
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