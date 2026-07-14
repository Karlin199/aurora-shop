import Panel from "@/components/ui/Panel";

const dueOrders = [
  {
    customer: "Smith",
    due: "Today",
    color: "text-red-400",
  },
  {
    customer: "Brown",
    due: "Tomorrow",
    color: "text-yellow-400",
  },
  {
    customer: "Johnson",
    due: "Friday",
    color: "text-green-400",
  },
];

export default function OrdersDue() {
  return (
    <Panel title="Orders Due Soon">
      <div className="space-y-4">
        {dueOrders.map((order) => (
          <div
            key={order.customer}
            className="flex justify-between border-b border-slate-700 pb-3"
          >
            <span>{order.customer}</span>

            <span className={order.color}>
              {order.due}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}