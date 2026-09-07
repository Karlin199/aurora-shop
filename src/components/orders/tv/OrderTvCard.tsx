"use client";

import DisplayButton from "@/components/display/common/DisplayButton";
import DisplayPanel from "@/components/display/common/DisplayPanel";
import { useDisplaySettings } from "@/components/display/DisplayContext";

type OrderItem = {
  item: string;
  color: string;
  qty: string;
};

type Order = {
  id: string;
  customer: string;
  dueDate: string;
  status: string;
  items: OrderItem[];
};

type Props = {
  order: Order;
  onComplete?: () => void;
};

export default function OrderTvCard({
  order,
  onComplete,
}: Props) {
  const { settings } = useDisplaySettings();

  const midpoint = Math.ceil(order.items.length / 2);

  const leftItems = order.items.slice(0, midpoint);
  const rightItems = order.items.slice(midpoint);

  function OrderColumn({
    items,
  }: {
    items: OrderItem[];
  }) {
    return (
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b border-slate-800 text-left text-xl uppercase tracking-widest text-slate-400">
            <th className="w-[12%] pb-4">
              Qty
            </th>

            <th className="w-[48%] pb-4">
              Product
            </th>

            <th className="w-[40%] pb-4">
              Color
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-slate-800/70"
            >
              <td className="py-5 text-4xl font-bold">
                {item.qty}
              </td>

              <td className="py-5 pr-4 text-4xl">
                {item.item}
              </td>

              <td className="py-5 text-3xl text-slate-300">
                {item.color}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <DisplayPanel className="w-full max-w-none overflow-hidden">

      {/* Customer */}

      {settings.showCustomer && (
        <div className="border-b border-slate-800 px-12 py-8">

          <div className="text-5xl font-black">
            {order.customer}
          </div>

        </div>
      )}

      {/* Products */}

      <div className="grid grid-cols-2 gap-12 px-12 py-8">

        {/* Left Column */}

        <div>
          <OrderColumn items={leftItems} />
        </div>

        {/* Right Column */}

        <div>
          {rightItems.length > 0 && (
            <OrderColumn items={rightItems} />
          )}
        </div>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-800 px-12 py-7">

        <div className="flex items-center gap-10">

          {settings.showDueDate && (
            <div className="text-xl">
              <span className="font-semibold text-slate-400">
                Due:
              </span>{" "}
              {order.dueDate}
            </div>
          )}

          {settings.showStatus && (
            <div className="text-xl">
              <span className="font-semibold text-slate-400">
                Status:
              </span>{" "}
              {order.status}
            </div>
          )}

        </div>

        <DisplayButton
          variant="success"
          onClick={onComplete}
        >
          ✓ COMPLETE ORDER
        </DisplayButton>

      </div>

    </DisplayPanel>
  );
}