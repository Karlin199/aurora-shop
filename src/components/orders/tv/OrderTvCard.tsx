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

  return (
    <DisplayPanel className="mx-auto max-w-7xl overflow-hidden">

      {/* Customer */}

      <div className="border-b border-slate-800 p-10">

        {settings.showCustomer && (
          <div className="border-b border-slate-800 p-10">
            <div className="mt-4 text-6xl font-black">
             {order.customer}
            </div>
          </div>
        )}

      </div>

      {/* Products */}

      <div className="p-10">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-800 text-left text-2xl uppercase tracking-widest text-slate-400">

              <th className="pb-5">
                Qty
              </th>

              <th className="pb-5">
                Product
              </th>

              <th className="pb-5">
                Color
              </th>

            </tr>

          </thead>

          <tbody>

            {order.items.map((item, index) => (

              <tr
                key={index}
                className="border-b border-slate-900"
              >

                <td className="py-6 text-5xl font-bold">
                  {item.qty}
                </td>

                <td className="py-6 text-5xl">
                  {item.item}
                </td>

                <td className="py-6 text-4xl text-slate-300">
                  {item.color}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-800 p-10">

        <div>

          {settings.showDueDate && (
            <div className="text-2xl">
              <span className="font-semibold text-slate-400">
                Due:
              </span>{" "}
              {order.dueDate}
            </div>
          )}

          {settings.showStatus && (
            <div className="mt-3 text-2xl">
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