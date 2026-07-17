import ProductionRow from "./ProductionRow";

type ProductionColour = {
  colour: string;

  required: number;
  inStock: number;
  toCut: number;

  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
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

  const showBoards = machine === "CNC";

  return (

    <section className="mb-12">

      {parts.map((partGroup) => (

        <div
          key={partGroup.part}
          className="mb-8 rounded-xl border border-slate-700 bg-slate-900/40 overflow-hidden"
        >

          {/* Part Heading */}

          <h2 className="bg-slate-800 px-6 py-4 text-3xl font-bold uppercase tracking-wide">

            {partGroup.part}

          </h2>

          {/* Column Headings */}

          <div className="grid grid-cols-12 pb-2 text-sm uppercase tracking-wide text-slate-500">

            <div className="col-span-6">

              Colour

            </div>

            <div className="col-span-2 text-right">

              Qty

            </div>

            {showBoards && (

              <>
                <div className="col-span-2 text-right">

                  Boards

                </div>

                <div className="col-span-2 text-right">

                  File

                </div>
              </>

            )}

          </div>

          {partGroup.colours.map((colour) => (

            <ProductionRow
              key={colour.colour}
              colour={colour.colour}
              quantity={colour.toCut}
              boards={
                showBoards
                  ? colour.boardsRequired
                  : undefined
              }
              cncFile={
                showBoards
                  ? colour.cncFile
                  : undefined
              }
            />

          ))}

        </div>

      ))}

    </section>

  );

}