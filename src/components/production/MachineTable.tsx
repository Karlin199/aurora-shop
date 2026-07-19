import ProductionRow from "./ProductionRow";

type ProductionColour = {
  colour: string;
  required: number;
  inStock: number;
  toCut: number;
};

type ProductionGroup = {
  part: string;
  colours: ProductionColour[];
};

type Props = {
  machine: string;
  parts: ProductionGroup[];
};

export default function MachineTable({
  machine,
  parts,
}: Props) {
  const totalParts = parts.reduce(
    (sum, part) => sum + part.colours.length,
    0
  );

  return (
    <div className="border border-slate-700 bg-slate-950 overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-600 bg-slate-900 px-8 py-6">

        <div className="text-3xl font-bold tracking-wide">
          {machine}
        </div>

        <div className="text-xl text-slate-300">
          {totalParts} Items Remaining
        </div>

      </div>

      {/* Column headings */}

      <div className="grid grid-cols-12 border-b border-slate-700 px-8 py-5 text-lg font-bold uppercase tracking-wider text-slate-300">

        <div className="col-span-8">
          Part / Colour
        </div>

        <div className="col-span-4 text-right">
          Qty
        </div>

      </div>

      {/* Production list */}

      {parts.map((part) => (
        <div key={part.part}>

          {/* Part */}

          <div className="grid grid-cols-12 border-b border-slate-700 bg-slate-900 px-8 py-5">

            <div className="col-span-12 text-3xl font-bold">

              {part.part}

            </div>

          </div>

          {/* Colours */}

          {part.colours.map((colour) => (
            <ProductionRow
              key={part.part + colour.colour}
              colour={colour.colour}
              quantity={colour.toCut}
            />
          ))}

        </div>
      ))}

    </div>
  );
}