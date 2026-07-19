import InventoryPage from "@/components/inventory/InventoryPage";
import PageHeader from "@/components/layout/PageHeader";

export default function Page() {
  return (
    <>
      <PageHeader title="Inventory" />
      <InventoryPage />
    </>
  );
}