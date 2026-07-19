type Props = {
  colour: string;
  quantity: number;
};

export default function ProductionRow({
  colour,
  quantity,
}: Props) {
  return (
    <div
      className="
        grid
        grid-cols-12
        items-center
        border-b
        border-slate-800
        px-8
        py-5
        hover:bg-slate-900
      "
    >
      <div className="col-span-8 pl-10 text-2xl font-medium text-slate-100">
        {colour}
      </div>

      <div className="col-span-4 text-right text-5xl font-bold text-white">
        {quantity}
      </div>
    </div>
  );
}