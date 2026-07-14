import MainLayout from "@/components/layout/MainLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProductionQueue from "@/components/dashboard/ProductionQueue";
import OrdersDue from "@/components/dashboard/OrdersDue";

export default function DashboardPage() {
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

        <DashboardStats />

        <div className="grid gap-8 lg:grid-cols-2">
          <ProductionQueue />
          <OrdersDue />
        </div>

      </div>

    </MainLayout>
  );
}