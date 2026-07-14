type Order = {
  customer: string;
  dueDate: string;
  status: string;
  items: {
    item: string;
    color: string;
    qty: string;
  }[];
};

type Props = {
  order: Order | null;
};

export default function OrderDetails({ order }: Props) {
  if (!order) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Select an order
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">

      <div className="border-b border-slate-700 p-6">
        <h2 className="text-2xl font-bold">
          {order.customer}
        </h2>

        <p className="mt-2 text-slate-400">
          Due {new Date(order.dueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">

        <div>
          <div className="text-sm text-slate-500">
            Status
          </div>

          <div className="mt-1 text-lg">
            {order.status}
          </div>
        </div>

        <div>

          <div className="mb-3 text-sm text-slate-500">
            Products
          </div>

          {order.items.map((item, i) => (

            <div
              key={i}
              className="mb-3 rounded-xl border border-slate-700 p-4"
            >

              <div className="font-medium">
                {item.item}
              </div>

              <div className="text-slate-400">
                {item.color}
              </div>

              <div className="text-sm text-slate-500">
                Qty {item.qty}
              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="border-t border-slate-700 p-6">

        <div className="flex gap-3">

          <button className="flex-1 rounded-xl bg-blue-600 py-3 hover:bg-blue-500">
            Edit
          </button>

          <button className="flex-1 rounded-xl bg-slate-700 py-3 hover:bg-slate-600">
            Print
          </button>

        </div>

      </div>

    </div>
  );
}