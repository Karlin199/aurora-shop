import ProductionRow from "./ProductionRow";

type ProductionPart = {
  part: string;
  required: number;
  inStock: number;
  toCut: number;
  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

type Props = {
  colour: string;
  parts: ProductionPart[];
  showBoards: boolean;
};

export default function ColourTable({
  colour,
  parts,
  showBoards,
}: Props) {
  return (
    <div className="mb-8">

      {/* Colour Heading */}

      <h3 className="mb-2 text-xl font-bold text-slate-300">

        {colour}

      </h3>

      {/* Column Headings */}

      <div className="grid grid-cols-12 border-b border-slate-600 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">

        <div className="col-span-6">
          Part
        </div>

        <div className="col-span-2 text-center">
          Qty
        </div>

        <div className="col-span-2 text-center">
          {showBoards ? "Boards" : ""}
        </div>

        <div className="col-span-2 text-right">
          {showBoards ? "File" : ""}
        </div>

      </div>

      {parts.map((part) => (

        <ProductionRow
          key={part.part}
          part={part.part}
          quantity={part.toCut}
          boards={showBoards ? part.boardsRequired : undefined}
          cncFile={showBoards ? part.cncFile : undefined}
        />

      ))}

    </div>
  );
}