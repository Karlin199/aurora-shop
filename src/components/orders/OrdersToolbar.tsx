
type Props = {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
};

export default function OrdersToolbar({
  search,
  setSearch,
  status,
  setStatus,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">

      <div className="flex flex-col gap-4 lg:flex-row">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, product, or colour..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
        >
          <option value="All">All Statuses</option>
          <option value="Waiting">Waiting</option>
          <option value="In Production">In Production</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

    </div>
  );
}