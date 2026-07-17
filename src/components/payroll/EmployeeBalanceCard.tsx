type Props = {
  employee: string;
  total: number;
  entries: number;
  onClick: () => void;
};

export default function EmployeeBalanceCard({
  employee,
  total,
  entries,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-6
        text-left
        transition
        hover:border-blue-500
        hover:bg-slate-800
        hover:shadow-lg
      "
    >
      <div className="flex items-start justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {employee}
          </h2>

          <p className="mt-2 text-slate-400">
            {entries} {entries === 1 ? "Entry" : "Entries"}
          </p>

        </div>

        <div className="text-right">

          <p className="text-sm uppercase tracking-wide text-slate-400">
            Owing
          </p>

          <p className="mt-1 text-4xl font-bold text-green-400">
            ${total.toFixed(2)}
          </p>

        </div>

      </div>

      <div className="mt-6 border-t border-slate-700 pt-4">

        <span className="text-blue-400 font-medium">
          View Details →
        </span>

      </div>

    </button>
  );
}