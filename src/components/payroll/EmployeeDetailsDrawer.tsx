"use client";

import { useEffect, useMemo, useState } from "react";
import PayConfirmationDialog from "./PayConfirmationDialog";
import PayrollSuccessOverlay from "./PayrollSuccessOverlay";

type Entry = {
  row: number;
  job: string;
  quantity: number;
  rate: number;
  total: number;
  date: string;
};

type GroupedEntry = {
  job: string;
  quantity: number;
  rate: number;
  total: number;
};

type Props = {
  employee: string | null;
  open: boolean;
  onClose: () => void;
  onPaid?: () => void;
};

export default function EmployeeDetailsDrawer({
  employee,
  open,
  onClose,
  onPaid,
}: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!open || !employee) return;

    loadEmployee();
  }, [employee, open]);

  async function loadEmployee() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/payroll/employee?employee=${encodeURIComponent(employee!)}`
      );

      const data = await res.json();

      setEntries(data);
    } finally {
      setLoading(false);
    }
  }

  async function payEmployee() {
    if (!employee) return;

    setPaying(true);

    try {
      await fetch("/api/payroll/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee,
        }),
      });

      setSuccessOpen(true);

      setTimeout(() => {
        setSuccessOpen(false);
        onPaid?.();
        onClose();
      }, 2000);
    } finally {
      setPaying(false);
    }
  }

  const total = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.total, 0);
  }, [entries]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<string, GroupedEntry>();

    entries.forEach((entry) => {
      // Include rate in the key in case the same job ever has
      // different piece rates.
      const key = `${entry.job}-${entry.rate}`;

      const existing = groups.get(key);

      if (existing) {
        existing.quantity += entry.quantity;
        existing.total += entry.total;
      } else {
        groups.set(key, {
          job: entry.job,
          quantity: entry.quantity,
          rate: entry.rate,
          total: entry.total,
        });
      }
    });

    return Array.from(groups.values());
  }, [entries]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-[500px] max-w-full flex-col border-l border-slate-700 bg-slate-900 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700 p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {employee}
            </h2>

            <p className="text-slate-400">
              Outstanding Work
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable Work Area */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-slate-400">
              Loading...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-slate-400">
              No unpaid entries.
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  {entries.length} unpaid{" "}
                  {entries.length === 1 ? "entry" : "entries"}
                </p>

                <p className="text-sm text-slate-400">
                  {groupedEntries.length}{" "}
                  {groupedEntries.length === 1 ? "job" : "jobs"}
                </p>
              </div>

              <div className="space-y-4">
                {groupedEntries.map((entry, index) => (
                  <div
                    key={`${entry.job}-${entry.rate}-${index}`}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold">
                          {entry.job}
                        </div>

                        <div className="mt-1 text-sm text-slate-400">
                          {entry.quantity}{" "}
                          {entry.quantity === 1 ? "piece" : "pieces"} × $
                          {entry.rate.toFixed(2)}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xl font-bold text-green-400">
                          ${entry.total.toFixed(2)}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          Job Total
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Payment Area */}
        <div className="shrink-0 border-t border-slate-700 bg-slate-900 p-6">
          <div className="mb-6 flex justify-between text-2xl font-bold">
            <span>Total</span>

            <span className="text-green-400">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            disabled={paying || entries.length === 0}
            className="w-full rounded-xl bg-green-600 py-4 text-lg font-semibold transition hover:bg-green-500 disabled:opacity-50"
          >
            {paying ? "Paying..." : "Pay Employee"}
          </button>
        </div>
      </aside>

      <PayConfirmationDialog
        open={confirmOpen}
        employee={employee ?? ""}
        total={total}
        entries={entries.length}
        paying={paying}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await payEmployee();
        }}
      />

      <PayrollSuccessOverlay
        open={successOpen}
        employee={employee ?? ""}
        total={total}
        entries={entries.length}
      />
    </>
  );
}