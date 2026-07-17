type Props = {
  open: boolean;
  employee: string;
  total: number;
  entries: number;
};

export default function PayrollSuccessOverlay({
  open,
  employee,
  total,
  entries,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90">

      <div className="text-center">

        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-green-600 text-6xl font-bold">
          ✓
        </div>

        <h1 className="mt-8 text-5xl font-bold">
          {employee} Paid
        </h1>

        <p className="mt-4 text-3xl text-green-400 font-semibold">
          ${total.toFixed(2)}
        </p>

        <p className="mt-2 text-xl text-slate-300">
          {entries} {entries === 1 ? "Entry" : "Entries"} Paid
        </p>

      </div>

    </div>
  );
}