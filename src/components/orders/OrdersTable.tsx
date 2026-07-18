"use client";

import { useEffect, useMemo, useState } from "react";

import OrdersPageHeader from "./OrdersPageHeader";
import OrdersToolbar from "./OrdersToolbar";
import OrdersList from "./OrdersList";
import OrderDetails from "./OrderDetails";
import OrderDialog from "./dialogs/OrderDialog";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SuccessDialog from "@/components/ui/SuccessDialog";

type Order = {
  id: string;
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

  const [showDialog, setShowDialog] = useState(false);

  const [dialogMode, setDialogMode] = useState<
    "new" | "edit"
  >("new");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<
    "delete" | "complete"
  >("complete");

  const [working, setWorking] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();

    setOrders(data);

    if (data.length > 0) {
      setSelectedOrder(data[0]);
    } else {
      setSelectedOrder(null);
    }
  }

  useEffect(() => {
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
        status === "All" ||
        order.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [orders, search, status]);

  useEffect(() => {
    if (
      selectedOrder &&
      !filteredOrders.includes(selectedOrder)
    ) {
      setSelectedOrder(filteredOrders[0] ?? null);
    }

    if (
      !selectedOrder &&
      filteredOrders.length > 0
    ) {
      setSelectedOrder(filteredOrders[0]);
    }
  }, [filteredOrders, selectedOrder]);

  function openNewOrder() {
    setDialogMode("new");
    setShowDialog(true);
  }

  function openEditOrder() {
    if (!selectedOrder) return;

    setDialogMode("edit");
    setShowDialog(true);
  }

  function deleteSelectedOrder() {
    if (!selectedOrder) return;

    setConfirmType("delete");
    setConfirmOpen(true);
  }

  function completeSelectedOrder() {
    if (!selectedOrder) return;

    setConfirmType("complete");
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!selectedOrder) return;

    setWorking(true);

    try {
      if (confirmType === "delete") {
        const response = await fetch(
          "/api/orders/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: selectedOrder.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error();
        }

        await loadOrders();

        setSuccessTitle("Order Deleted");
        setSuccessMessage(
          `${selectedOrder.id} has been deleted.`
        );
      } else {
        const response = await fetch(
          "/api/orders/complete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: selectedOrder.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error();
        }

        await loadOrders();

        setSuccessTitle("Order Completed");
        setSuccessMessage(
          `${selectedOrder.id} has been marked as completed.`
        );
      }

      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch {
      alert("Something went wrong.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-6">

      <OrdersPageHeader
        onNewOrder={openNewOrder}
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

          <OrderDetails
            order={selectedOrder}
            onEdit={openEditOrder}
            onDelete={deleteSelectedOrder}
            onComplete={completeSelectedOrder}
          />

        </div>

      </div>

      <OrderDialog
        open={showDialog}
        mode={dialogMode}
        order={selectedOrder}
        onClose={() => setShowDialog(false)}
        onSaved={async () => {
          await loadOrders();
          setShowDialog(false);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={
          confirmType === "delete"
            ? "Delete Order"
            : "Complete Order"
        }
        message={
          confirmType === "delete"
            ? `Are you sure you want to delete "${selectedOrder?.id}"?\n\nThis cannot be undone.`
            : `Mark "${selectedOrder?.id}" as completed?`
        }
        confirmText={
          confirmType === "delete"
            ? "Delete"
            : "Complete"
        }
        confirmColor={
          confirmType === "delete"
            ? "red"
            : "green"
        }
        loading={working}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />

      <SuccessDialog
        open={successOpen}
        title={successTitle}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />

    </div>
  );
}