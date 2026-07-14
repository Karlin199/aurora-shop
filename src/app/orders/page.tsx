import MainLayout from "@/components/layout/MainLayout";
import OrdersTable from "@/components/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Orders</h1>

            <p className="mt-2 text-slate-400">
              Manage customer orders and production.
            </p>
          </div>

          <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition">
            + New Order
          </button>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">

          <div className="flex flex-col gap-4 lg:flex-row">

            <input
              type="text"
              placeholder="Search customer, product, or colour..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <select className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <option>All Statuses</option>
              <option>Waiting</option>
              <option>In Production</option>
              <option>Completed</option>
            </select>

          </div>

        </div>

        <OrdersTable />

      </div>
    </MainLayout>
  );
}