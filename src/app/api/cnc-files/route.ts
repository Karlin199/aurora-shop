import { NextResponse } from "next/server";
import { getCNCParts } from "@/services/parts";

export async function GET() {
  try {
    const parts = await getCNCParts();

    return NextResponse.json(
      parts.map((part, index) => ({
        id: String(index + 1),
        part: part.name,
        file: part.cncFile,
        modified: "",
        downloadUrl: part.oneDriveLink,
      }))
    );
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