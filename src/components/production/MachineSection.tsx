import ProductionCard from "./ProductionCard";

type ProductionPart = {
  part: string;
  required: number;
  inStock: number;
  toCut: number;
  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

type ProductionColour = {
  colour: string;
  parts: ProductionPart[];
};

type Props = {
  machine: string;
  colours: ProductionColour[];
};

export default function MachineSection({
  machine,
  colours,
}: Props) {

  const totalParts = colours.reduce(
    (sum, colour) =>
      sum +
      colour.parts.reduce(
        (s, part) => s + part.toCut,
        0
      ),
    0
  );

  const totalBoards = colours.reduce(
    (sum, colour) =>
      sum +
      colour.parts.reduce(
        (s, part) => s + part.boardsRequired,
        0
      ),
    0
  );

  return (

    <section className="rounded-2xl border border-slate-700 bg-slate-900">

      <div
       className="
         border-b
         border-slate-700
         bg-slate-950
         px-8
         py-6
        "
      >

        <div className="flex items-center justify-between">

         <div>

            <div className="text-sm uppercase tracking-[0.35em] text-slate-500">

             Production Station

            </div>

            <h2 className="mt-2 text-4xl font-black uppercase tracking-wide">

             {machine}

            </h2>

          </div>

          <div className="flex gap-4">

            <div className="rounded-xl bg-slate-900 px-6 py-3 text-center">

              <div className="text-3xl font-black">

                {totalParts}

              </div>

              <div className="text-xs uppercase tracking-widest text-slate-400">

                 Parts

              </div>

            </div>

             {totalBoards > 0 && (

              <div className="rounded-xl bg-slate-900 px-6 py-3 text-center">

                <div className="text-3xl font-black">

                 {totalBoards}

                </div>

                <div className="text-xs uppercase tracking-widest text-slate-400">

                 Boards

                </div>

              </div>

            )}

          </div>

         </div>

        </div>
      <div className="space-y-5 p-6">

        {colours.map((colour) => (

          <div key={colour.colour}>

            <div
             className="
              mb-3
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-6
              py-4
             "
            >

              <h3 className="text-2xl font-black uppercase tracking-wide">

                {colour.colour}

              </h3>

            </div>

            <div 
             className="
             grid
             gap-4
             md:grid-cols-3
             xl:grid-cols-4
             2xl:grid-cols-5
             "
            >

              {colour.parts.map((part) => (

                <ProductionCard
                  key={part.part}
                  part={part.part}
                  color={colour.colour}
                  toCut={part.toCut}
                  boardsRequired={part.boardsRequired}
                  cncFile={part.cncFile}
                />

              ))}

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}