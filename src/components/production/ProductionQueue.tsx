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

      {/* Queue */}

      <div className="grid grid-cols-2 gap-6">
        {parts.map((part) => (
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
              <button className="rounded-lg bg-green-600 px-4 py-2 text-lg font-semibold hover:bg-green-700">
                Run Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}