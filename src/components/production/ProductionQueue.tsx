import type { ProductionGroup } from "@/services/production";

type Props = {
  machine: string;
  parts: ProductionGroup[];
};

export default function ProductionQueue({
  machine,
  parts,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="border-b border-gray-600 pb-4">
        <h2 className="text-5xl font-bold uppercase">
          {machine}
        </h2>

        <p className="mt-2 text-2xl text-gray-400">
          {parts.length} Parts Waiting
        </p>
      </div>

      {/* Queue */}

      <div className="grid grid-cols-2 gap-6">
        {parts.map((part) => (
          <div
            key={part.part}
            className="rounded-xl border border-gray-700 bg-[#1d2433] p-6"
          >
            {/* Part Name */}

            <h3 className="text-4xl font-bold">
              {part.part}
            </h3>

            {/* Total */}

            <p className="mt-2 text-xl text-blue-400">
              {part.totalToCut} TO CUT
            </p>

            {/* Colours */}

            <div className="mt-6 space-y-3">
              {part.colours.map((colour, index) => (
                <div
                  key={`${part.part}-${colour.colour}-${index}`}
                  className="flex justify-between text-3xl"
                >
                  <span>
                    {colour.colour}
                  </span>

                  <span className="font-bold">
                    {colour.toCut}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}

            <div className="mt-8 flex justify-end">
              <button className="rounded-lg bg-green-600 px-5 py-3 text-xl font-semibold hover:bg-green-700">
                Run Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}