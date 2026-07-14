import MainLayout from "@/components/layout/MainLayout";
import OrdersTable from "@/components/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <MainLayout>
      <OrdersTable />
    </MainLayout>
  );
}