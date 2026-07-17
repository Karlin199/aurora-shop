type Props = {
  colour: string;
  quantity: number;
  boards?: number;
  cncFile?: string;
};

export default function ProductionRow({
  colour,
  quantity,
  boards,
  cncFile,
}: Props) {
  return (
    <div
      className="
       grid
       grid-cols-12
       items-center
       px-6
       py-4
       even:bg-slate-900/30
       hover:bg-slate-800/40
       transition-colors
     "
    >
      {/* Colour */}

      <div className="col-span-6 text-2xl font-medium text-slate-100">

        {colour}

      </div>

      {/* Quantity */}

      <div className="col-span-2 text-right">

        <span className="text-5xl font-bold text-blue-400">

          {quantity}

        </span>

      </div>

      {/* Boards */}

      {boards !== undefined && (

        <div className="col-span-2 text-right">

          <span className="text-2xl font-semibold">

            {boards}

          </span>

        </div>

      )}

      {/* CNC File */}

      {cncFile !== undefined && (

        <div className="col-span-2 text-right">

          <span className="font-mono text-slate-400">

            {cncFile}

          </span>

        </div>

      )}

    </div>
  );
}