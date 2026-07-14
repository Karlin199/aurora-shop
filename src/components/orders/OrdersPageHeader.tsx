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

      <button
        onClick={onNewOrder}
        className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition"
      >
        + New Order
      </button>

    </div>
  );
}