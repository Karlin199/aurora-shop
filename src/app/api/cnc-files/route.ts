import { NextResponse } from "next/server";
import { getCNCFiles } from "@/services/parts";

export async function GET() {
  try {
    const files = await getCNCFiles();

    return NextResponse.json(
      files.map((file, index) => ({
        id: String(index + 1),
        part: file.partName,
        file: file.fileName,
        modified: "",
        downloadUrl: "",
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