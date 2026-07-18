import Panel from "@/components/ui/Panel";
import { DashboardOrder } from "@/types/dashboard";

type Props = {
  orders: DashboardOrder[];
};

function getDueStatus(date: string) {
  const due = new Date(date);
  const today = new Date();

  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff =
    (due.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (diff < 0) {
    return {
      label: "Overdue",
      color: "text-red-400",
    };
  }

  if (diff === 0) {
    return {
      label: "Today",
      color: "text-red-400",
    };
  }

  if (diff === 1) {
    return {
      label: "Tomorrow",
      color: "text-yellow-400",
    };
  }

  return {
    label: due.toLocaleDateString(),
    color: "text-green-400",
  };
}

export default function OrdersDue({
  orders,
}: Props) {
  return (
    <Panel title="Orders Due Soon">
      <div className="space-y-4">

        {orders.length === 0 && (
          <div className="text-slate-400">
            No active orders.
          </div>
        )}

        {orders
          .slice()
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() -
              new Date(b.dueDate).getTime()
          )
          .slice(0, 5)
          .map((order) => {
            const status = getDueStatus(order.dueDate);

            return (
              <div
                key={order.id}
                className="flex justify-between border-b border-slate-700 pb-3"
              >
                <div>
                  <div className="font-medium">
                    {order.customer}
                  </div>

                  <div className="text-sm text-slate-400">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </div>
                </div>

                <span className={status.color}>
                  {status.label}
                </span>
              </div>
            );
          })}

      </div>
    </Panel>
  );
}