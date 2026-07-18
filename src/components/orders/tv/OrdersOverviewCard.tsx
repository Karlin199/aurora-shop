"use client";

import DisplayMetric from "@/components/display/common/DisplayMetric";
import DisplayPanel from "@/components/display/common/DisplayPanel";
import { useDisplaySettings } from "@/components/display/DisplayContext";

type OrderItem = {
  qty: string;
};

type Order = {
  id: string;
  customer: string;
  items: OrderItem[];
};

type Props = {
  orders: Order[];
};

export default function OrdersOverviewCard({
  orders,
}: Props) {
  const { settings } = useDisplaySettings();

  const outstandingOrders = orders.length;

  const productsOnOrder = orders.reduce((total, order) => {
    return (
      total +
      order.items.reduce(
        (sum, item) => sum + Number(item.qty || 0),
        0
      )
    );
  }, 0);

  const customers =
    settings.customersToShow >= orders.length
      ? orders
      : orders.slice(0, settings.customersToShow);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">

      {/* Top Metrics */}

      <div className="grid grid-cols-2 gap-8">

        <DisplayMetric
          label="Outstanding Orders"
          value={outstandingOrders}
        />

        <DisplayMetric
          label="Products on Order"
          value={productsOnOrder}
        />

      </div>

      {/* Customers */}

      <DisplayPanel className="p-10">

        <div className="mb-8 text-4xl font-bold">
          Next Customers
        </div>

        {customers.length === 0 ? (
          <div className="py-20 text-center text-3xl text-slate-400">
            No outstanding orders
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-20 gap-y-6">

            {customers.map((order, index) => (

              <div
                key={order.id}
                className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-6 py-5"
              >

                <div className="w-16 text-3xl font-bold text-slate-500">
                  {index + 1}
                </div>

                <div className="text-3xl font-semibold">
                  {order.customer}
                </div>

              </div>

            ))}

          </div>
        )}

      </DisplayPanel>

    </div>
  );
}