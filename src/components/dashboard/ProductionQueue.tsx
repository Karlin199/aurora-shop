import Panel from "@/components/ui/Panel";

import { DashboardOrder } from "@/types/dashboard";

type Props = {
  orders: DashboardOrder[];
};

function formatDueDate(date: string) {
  const due = new Date(date);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff =
    (due.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return "Overdue";

  return due.toLocaleDateString();
}

export default function ProductionQueue({
  orders,
}: Props) {
  return (
    <Panel title="Today's Production Queue">
      <div className="space-y-4">

        {orders.length === 0 && (
          <div className="text-slate-400">
            No active orders.
          </div>
        )}

        {orders.slice(0, 10).map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-slate-700 p-4"
          >
            <div className="font-semibold">
              {order.customer}
            </div>

            <div className="mt-2 space-y-1">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="text-slate-300"
                >
                  {item.qty} × {item.item}
                  {item.color && ` - ${item.color}`}
                </div>
              ))}
            </div>

            <div className="mt-3 text-sm text-slate-500">
              Due: {formatDueDate(order.dueDate)}
            </div>
          </div>
        ))}

      </div>
    </Panel>
  );
}