import {
  Package,
  Scissors,
  TriangleAlert,
  CheckCircle2,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

export default function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Outstanding Orders"
        value={18}
        subtitle="3 added today"
        icon={<Package size={26} />}
      />

      <StatCard
        title="Parts To Cut"
        value={42}
        subtitle="12 urgent"
        icon={<Scissors size={26} />}
      />

      <StatCard
        title="Inventory Alerts"
        value={5}
        subtitle="Needs attention"
        icon={<TriangleAlert size={26} />}
      />

      <StatCard
        title="Completed This Week"
        value={21}
        subtitle="Great progress"
        icon={<CheckCircle2 size={26} />}
      />

    </div>
  );
}