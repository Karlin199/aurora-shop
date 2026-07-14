"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Scissors,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

type DashboardStats = {
  outstandingOrders: number;
  partsToCut: number;
  inventoryAlerts: number;
  completedThisWeek: number;
};

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      setStats(data.stats);
    }

    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Outstanding Orders"
        value={stats.outstandingOrders}
        subtitle="Awaiting production"
        icon={<Package size={26} />}
      />

      <StatCard
        title="Parts To Cut"
        value={stats.partsToCut}
        subtitle="Awaiting cutting"
        icon={<Scissors size={26} />}
      />

      <StatCard
        title="Inventory Alerts"
        value={stats.inventoryAlerts}
        subtitle="Needs attention"
        icon={<TriangleAlert size={26} />}
      />

      <StatCard
        title="Completed This Week"
        value={stats.completedThisWeek}
        subtitle="Finished orders"
        icon={<CheckCircle2 size={26} />}
      />

    </div>
  );
}