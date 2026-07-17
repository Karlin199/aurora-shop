type Props = {
  part: string;
  color: string;
  toCut: number;
  boardsRequired: number;
  cncFile: string;
};

export default function ProductionCard({
  part,
  toCut,
  boardsRequired,
  cncFile,
}: Props) {
  const isCnc = boardsRequired > 0;

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-700
        bg-slate-950
        p-5
        transition-all
        duration-200
        hover:border-blue-500
        hover:-translate-y-1
      "
    >
      {/* Part */}

      <h3 className="text-xl font-bold uppercase">

        {part}

      </h3>

      {/* Numbers */}

      <div className="mt-5 flex items-end justify-between">

        <div>

          <div className="text-6xl font-black text-blue-400 leading-none">

            {toCut}

          </div>

          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">

            Parts

          </div>

        </div>

        {isCnc && (

          <div className="text-right">

            <div className="text-4xl font-black">

              {boardsRequired}

            </div>

            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">

              Boards

            </div>

          </div>

        )}

      </div>

      {cncFile && (

        <div className="mt-5 border-t border-slate-800 pt-4 text-sm">

          <span className="text-slate-500">

            Run File

          </span>

          <div className="font-semibold">

            {cncFile}

          </div>

        </div>

      )}

    </div>
  );
}