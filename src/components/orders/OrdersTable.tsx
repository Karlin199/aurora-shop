"use client";

import { useEffect, useMemo, useState } from "react";

import OrdersPageHeader from "./OrdersPageHeader";
import OrdersToolbar from "./OrdersToolbar";
import OrdersList from "./OrdersList";
import OrderDetails from "./OrderDetails";
import NewOrderDialog from "./dialogs/NewOrderDialog";

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

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showNewOrder, setShowNewOrder] = useState(false);

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.items.some(
          (item) =>
            item.item
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            item.color
              .toLowerCase()
              .includes(search.toLowerCase())
        );

      const matchesStatus =
        status === "All" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  useEffect(() => {
    if (
      selectedOrder &&
      !filteredOrders.includes(selectedOrder)
    ) {
      setSelectedOrder(filteredOrders[0] ?? null);
    }

    if (!selectedOrder && filteredOrders.length > 0) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [filteredOrders, selectedOrder]);

  return (
    <div className="space-y-6">

      <OrdersPageHeader
        onNewOrder={() => setShowNewOrder(true)}
      />

      <OrdersToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">

        <OrdersList
          orders={filteredOrders}
          selectedOrder={selectedOrder}
          onSelect={setSelectedOrder}
        />

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60 min-h-[700px]">

          <OrderDetails order={selectedOrder} />

        </div>

      </div>

    <NewOrderDialog
      open={showNewOrder}
      onClose={() => setShowNewOrder(false)}
    />

  </div>
  );
}