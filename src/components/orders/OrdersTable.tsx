"use client";

import { useEffect, useState } from "react";
import OrderDetails from "./OrderDetails";
import OrderCard from "./OrderCard";

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

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  useEffect(() => {
    async function loadOrders() {
      const res = await fetch("/api/orders");
      const data = await res.json();

      setOrders(data);

      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

      {/* Left Side */}

      <div className="space-y-4">

        {orders.map((order, index) => (

          <OrderCard
            key={index}
            order={order}
            selected={selectedOrder === order}
            onClick={() => setSelectedOrder(order)}
          />

        ))}

      </div>

      {/* Right Side */}

      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60 min-h-[700px]">

        <OrderDetails order={selectedOrder} />

      </div>

    </div>
  );
}