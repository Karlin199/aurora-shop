"use client";

import { useEffect, useState } from "react";

import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProductionQueue from "@/components/dashboard/ProductionQueue";
import OrdersDue from "@/components/dashboard/OrdersDue";
import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      setDashboard(data);
    }

    loadDashboard();
  }, []);

  if (!dashboard) {
    return (
      <MainLayout>
        <div className="text-slate-400">
          Loading Dashboard...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Aurora Outdoor Furniture Production Management
          </p>
        </div>

        <DashboardStats stats={dashboard} />

        <div className="grid gap-8 lg:grid-cols-2">
         <ProductionQueue
           orders={dashboard.orders}
          />

         <OrdersDue
           orders={dashboard.orders}
          />
        </div>

      </div>

    </MainLayout>
  );
}