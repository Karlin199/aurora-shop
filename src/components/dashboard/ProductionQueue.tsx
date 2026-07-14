import Panel from "@/components/ui/Panel";

const jobs = [
  {
    customer: "Smith",
    item: "2 Luxe Gliders",
    due: "Today",
  },
  {
    customer: "Brown",
    item: "4 Sapphire Chairs",
    due: "Tomorrow",
  },
  {
    customer: "Johnson",
    item: "1 Luxe Table",
    due: "Friday",
  },
];

export default function ProductionQueue() {
  return (
    <Panel title="Today's Production Queue">
      <div className="space-y-4">

        {jobs.map((job) => (
          <div
            key={job.customer}
            className="rounded-xl border border-slate-700 p-4"
          >
            <div className="font-semibold">
              {job.customer}
            </div>

            <div className="text-slate-300">
              {job.item}
            </div>

            <div className="text-sm text-slate-500">
              Due: {job.due}
            </div>
          </div>
        ))}

      </div>
    </Panel>
  );
}