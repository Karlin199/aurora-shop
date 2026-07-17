type Props = {
  open: boolean;
  employee: string;
  total: number;
  entries: number;
  paying: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function PayConfirmationDialog({
  open,
  employee,
  total,
  entries,
  paying,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={onCancel}
      />

      <div className="fixed left-1/2 top-1/2 z-50 w-[450px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

        <h2 className="text-2xl font-bold">
          Pay {employee}?
        </h2>

        <p className="mt-4 text-slate-400">
          This will mark{" "}
          <span className="font-semibold text-white">
            {entries}
          </span>{" "}
          {entries === 1 ? "entry" : "entries"} as paid.
        </p>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-5">

          <div className="flex justify-between text-lg">
            <span>Total</span>

            <span className="font-bold text-green-400">
              ${total.toFixed(2)}
            </span>

          </div>

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onCancel}
            disabled={paying}
            className="rounded-xl border border-slate-600 px-6 py-3 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={paying}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500 disabled:opacity-50"
          >
            {paying ? "Paying..." : "Pay Employee"}
          </button>

        </div>

      </div>
    </>
  );
}