import {
  Package,
  Scissors,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import { DashboardData } from "@/types/dashboard";

type Props = {
  stats: DashboardData;
};

export default function DashboardStats({
  stats,
}: Props) {
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