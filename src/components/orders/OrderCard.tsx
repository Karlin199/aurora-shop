import {
  CalendarDays,
  ChevronRight,
  Package,
} from "lucide-react";

type Props = {
  order: any;
  selected: boolean;
  onClick: () => void;
};

function getStatusColour(status: string) {
  switch (status) {
    case "Waiting":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";

    case "In Production":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";

    case "Completed":
      return "bg-green-500/20 text-green-300 border-green-500/30";

    default:
      return "bg-slate-700 text-slate-300";
  }
}

export default function OrderCard({
  order,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-6 text-left transition ${
        selected
          ? "border-blue-500 bg-slate-900"
          : "border-slate-700 bg-slate-900/60 hover:border-blue-500"
      }`}
    >
      <div className="flex justify-between">

        <div>

          <div className="text-xl font-semibold">
            {order.customer}
          </div>

          <div className="mt-4 flex gap-5 text-sm text-slate-400">

            <div className="flex items-center gap-2">
              <Package size={16} />
              {order.items.length} Products
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {new Date(order.dueDate).toLocaleDateString()}
            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <div
            className={`rounded-full border px-3 py-1 text-sm ${getStatusColour(
              order.status
            )}`}
          >
            {order.status}
          </div>

          <ChevronRight size={20} />

        </div>

      </div>
    </button>
  );
}