import Link from "next/link";
import { Monitor } from "lucide-react";

type Props = {
  onNewOrder: () => void;
};

export default function OrdersPageHeader({
  onNewOrder,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold">
          Orders
        </h1>

        <p className="mt-2 text-slate-400">
          Manage customer orders and production.
        </p>

      </div>

      <div className="flex items-center gap-3">

        <Link
         href="/orders/tv"
         target="_blank"
         className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-medium transition hover:bg-slate-700"
        >
          <Monitor size={18} />
          TV Display
        </Link>

        <button
         onClick={onNewOrder}
         className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
        >
         + New Order
        </button>

      </div>

    </div>
  );
}