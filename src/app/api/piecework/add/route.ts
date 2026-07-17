import { NextRequest, NextResponse } from "next/server";
import { getPieceJobs } from "@/services/pieceJobs";
import { addEntry } from "@/services/piecework";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      employee,
      job,
      quantity,
    } = body;

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          error: "Employee is required.",
        },
        { status: 400 }
      );
    }

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: "Job is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Quantity must be greater than zero.",
        },
        { status: 400 }
      );
    }

    const jobs = await getPieceJobs();

    const selectedJob = jobs.find(
      (j) => j.job === job
    );

    if (!selectedJob) {
      return NextResponse.json(
        {
          success: false,
          error: "Job not found.",
        },
        { status: 404 }
      );
    }

    const result = await addEntry(
      employee,
      selectedJob.job,
      quantity,
      selectedJob.rate
    );

    return NextResponse.json({
      success: true,
      earned: result.total,
    });

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