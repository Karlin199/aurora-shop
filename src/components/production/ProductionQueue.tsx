"use client";

import { useState } from "react";
import type { ProductionGroup } from "@/services/production";
import type { CncProductionRecommendation } from "@/lib/domain/cncCalculations";
import RunCompleteDialog from "./RunCompleteDialog";

type Props = {
  machine: string;
  parts: ProductionGroup[];
  cncRuns: CncProductionRecommendation[];
};

export default function ProductionQueue({
  machine,
  parts,
  cncRuns,
}: Props) {

    const [selectedPart, setSelectedPart] =
     useState<ProductionGroup | null>(null);

    const [dialogOpen, setDialogOpen] =
     useState(false);

    function openDialog(part: ProductionGroup) {
     setSelectedPart(part);
     setDialogOpen(true);
    }

    function closeDialog() {
     setDialogOpen(false);
     setSelectedPart(null);
    }

  return (

    <div className="space-y-8">

      {/* Queue */}

      {cncRuns.length > 0 && (
        <div className="space-y-6">
          {cncRuns.map((run) => (
            <div key={run.fileName} className="rounded-xl border border-blue-700 bg-blue-950/30 p-6">
              <h3 className="text-3xl font-extrabold">CNC Run: {run.fileName}</h3>
              <p className="mt-2 text-xl text-gray-300">
                {run.completeRunsRequired} complete run{run.completeRunsRequired === 1 ? "" : "s"} · {run.totalBoardsPerRun} boards per run · {run.customerColorBoardsPerRun} customer-color · {run.fixedColorBoardsPerRun} black
              </p>
              {run.validationErrors.map((error) => (
                <p key={error} className="mt-3 font-semibold text-amber-300">{error}</p>
              ))}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {run.outputs.map((output) => (
                  <div key={`${output.partName}-${output.color}`} className="rounded-lg bg-[#151c28] px-4 py-3">
                    <div className="font-bold">{output.partName} · {output.color}</div>
                    <div className="text-lg">{output.expectedOutput} expected / {output.expectedSurplus} surplus</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {parts.filter((part) => !part.cncFile).map((part) => (
          <div
            key={part.part}
            className="rounded-xl border border-gray-700 bg-[#1d2433] p-8"
          >
            {/* Part Name */}

            <h3 className="text-4xl font-extrabold leading-tight">
              {part.part}
            </h3>

            {/* Total */}

            <p className="mt-2 text-xl uppercase tracking-wider text-gray-500">
              {part.totalToCut} TO CUT
            </p>

            {/* Colour List */}

            <div className="mt-8 rounded-lg bg-[#151c28] px-6 py-5">

              <div className="space-y-4">

               {part.colours.map((colour, index) => (

                <div
                 key={`${part.part}-${colour.colour}-${index}`}
                 className="flex items-center justify-between border-b border-gray-700 pb-3 last:border-b-0 last:pb-0"
                >

                  <span className="text-4xl font-bold tracking-wide">
                   {colour.colour}
                   </span>

                   <span className="text-5xl font-black">
                   {colour.toCut}
                  </span>

                </div>

              ))}

            </div>

          </div>

            {/* Button */}

            <div className="mt-8 flex justify-end">
              <button
               onClick={() => openDialog(part)}
               className="rounded-lg bg-green-600 px-4 py-2 text-lg font-semibold hover:bg-green-700"
              >
               Run Complete
              </button>
            </div>
          </div>
        ))}
      </div>

      <RunCompleteDialog
       open={dialogOpen}
       part={selectedPart}
       onClose={closeDialog}
       onCompleted={() => window.location.reload()}
      />

    </div>
  );
}