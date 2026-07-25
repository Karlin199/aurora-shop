"use client";

import { useEffect, useState } from "react";
import type { ProductionGroup } from "@/services/production";

type Props = {
  part: ProductionGroup | null;
  open: boolean;
  onClose: () => void;
  onCompleted: () => void;
};

const SHOP_COLOURS = [
  "Slate Gray",
  "Cherry",
  "Weathered Wood",
  "Toffee",
  "Pecan",
  "Marble",
  "Granite",
  "Black", 
];

export default function RunCompleteDialog({
  part,
  open,
  onClose,
  onCompleted,
}: Props) {

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");   
  const [values, setValues] =
    useState<Record<string, number>>({});

  async function completeRun() {

    if (!part) return;

    setSaving(true);
    setError("");

    try {

      const cuts = Object.entries(values)
        .map(([colour, quantity]) => ({
         colour,
         quantity,
        }))
        .filter((c) => c.quantity > 0);

      const response = await fetch(
        "/api/production/complete",
        {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
          },
         body: JSON.stringify({
           part: part.part,
           cuts,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
         result.error ?? "Unknown error"
        );
      }

      onCompleted();
      onClose();

    } catch (err) {

      setError(
        err instanceof Error
         ? err.message
         : "Unknown error"
      );

    } finally {

     setSaving(false);

    }

  }

  useEffect(() => {

    if (!part) return;

    const startingValues: Record<string, number> = {};

    SHOP_COLOURS.forEach((colour) => {

      const scheduled = part.colours.find(
        (c) => c.colour === colour
      );

      startingValues[colour] =
        scheduled?.toCut ?? 0;

    });

    setValues(startingValues);

  }, [part]);

  if (!open || !part) return null;

  const expectedTotal =
    part.totalToCut;

  const enteredTotal =
    Object.values(values).reduce(
      (a, b) => a + b,
      0
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-[650px] rounded-xl bg-[#1d2433] p-8">

        <h2 className="text-4xl font-bold">
          Complete Run
        </h2>

        <p className="mt-2 text-2xl text-gray-300">
          {part.part}
        </p>

        <div className="mt-8 space-y-4">

          {SHOP_COLOURS.map((colour) => (

            <div
              key={colour}
              className="flex items-center justify-between"
            >

              <span className="text-2xl">
                {colour}
              </span>

              <input
                type="number"
                value={values[colour] ?? 0}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [colour]:
                      Number(e.target.value),
                  })
                }
                className="w-24 rounded bg-gray-800 px-3 py-2 text-right text-2xl"
              />

            </div>

          ))}

        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">

          <div className="flex justify-between text-xl">

            <span>Expected Total</span>

            <span>{expectedTotal}</span>

          </div>

          <div className="mt-2 flex justify-between text-xl font-bold">

            <span>Entered Total</span>

            <span>
              {enteredTotal}
            </span>

          </div>

        </div>

        {error && (
          <div className="mt-6 rounded bg-red-900/40 p-3 text-red-300">
           {error}
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded bg-gray-700 px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={completeRun}
            disabled={saving}
            className="rounded bg-green-600 px-5 py-3"
          >
            {saving ? "Saving..." : "Complete Run"}
          </button>

        </div>

      </div>

    </div>
  );

}