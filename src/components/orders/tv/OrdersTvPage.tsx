"use client";

import { useEffect, useState } from "react";

import DisplayConfirmDialog from "@/components/display/DisplayConfirmDialog";
import DisplayLayout from "@/components/display/DisplayLayout";
import DisplaySuccessDialog from "@/components/display/DisplaySuccessDialog";
import {
  useDisplaySettings,
} from "@/components/display/DisplayContext";
import DisplayCarousel from "@/components/display/DisplayCarousel";

import OrderTvCard from "./OrderTvCard";
import OrdersFooter from "./OrdersFooter";
import OrdersOverviewCard from "./OrdersOverviewCard";

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

const STORAGE_KEY = "aurora-orders-tv-index";

export default function OrdersTvPage() {
  const { settings } = useDisplaySettings();

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");

      if (!res.ok) {
        throw new Error("Failed to load orders.");
      }

      const data = await res.json();

      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  }

  //
  // Initial load
  //

  useEffect(() => {
    loadOrders();
  }, []);

  //
  // Auto refresh
  //

  useEffect(() => {
    const timer = setInterval(
      loadOrders,
      settings.refresh * 1000
    );

    return () => clearInterval(timer);
  }, [settings.refresh]);

  //
  // Restore last viewed page
  //

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const index = Number(saved);

    if (!Number.isNaN(index)) {
      setCurrentIndex(index);
    }
  }, []);

  //
  // Save current page
  //

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      String(currentIndex)
    );
  }, [currentIndex]);

  //
  // Keep index valid
  //

  useEffect(() => {
    if (currentIndex > orders.length) {
      setCurrentIndex(orders.length);
    }
  }, [orders.length, currentIndex]);

  //
  // Keyboard navigation
  //

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
          setCurrentIndex((current) =>
            Math.min(current + 1, orders.length)
          );
          break;

        case "ArrowLeft":
          setCurrentIndex((current) =>
            Math.max(current - 1, 0)
          );
          break;

        case "Home":
          setCurrentIndex(0);
          break;

        case "End":
          setCurrentIndex(orders.length);
          break;
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [orders.length]);

  const currentOrder =
    currentIndex > 0
      ? orders[currentIndex - 1]
      : null;

  function handleCompleteOrder() {
    if (!currentOrder) return;

    setConfirmOpen(true);
  }

  async function confirmCompleteOrder() {
    setConfirmOpen(false);

    //
    // API call will go here
    //

    setSuccessOpen(true);

    setTimeout(() => {
      setSuccessOpen(false);

      if (settings.autoAdvance) {
        setCurrentIndex((current) =>
          Math.min(current + 1, orders.length)
        );
      }
    }, 1500);
  }

  return (
    <>
      <DisplayLayout
        title="Orders Display"
        footer={
          <OrdersFooter
            currentIndex={currentIndex}
            totalOrders={orders.length}
          />
        }
      >

        <DisplayCarousel index={currentIndex}>
         <OrdersOverviewCard orders={orders} />

         {orders.map((order) => (
           <OrderTvCard
             key={order.id}
             order={order}
             onComplete={handleCompleteOrder}
            />
          ))}
        </DisplayCarousel>

      </DisplayLayout>

      <DisplayConfirmDialog
        open={confirmOpen}
        title="Complete Order?"
        message="Mark this order as completed?"
        confirmText="Complete"
        cancelText="Cancel"
        onConfirm={confirmCompleteOrder}
        onCancel={() => setConfirmOpen(false)}
      />

      <DisplaySuccessDialog
        open={successOpen}
      />
    </>
  );
}