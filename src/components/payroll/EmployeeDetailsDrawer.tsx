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
    return entries.reduce((sum, e) => sum + e.total, 0);
  }, [entries]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 h-full w-[500px] max-w-full bg-slate-900 border-l border-slate-700 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700 p-6">

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
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {loading ? (
            <div className="text-slate-400">
              Loading...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-slate-400">
              No unpaid entries.
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.row}
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">
                        {entry.job}
                      </div>

                      <div className="text-sm text-slate-400 mt-1">
                        {entry.quantity} × ${entry.rate.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-xl font-bold text-green-400">
                      ${entry.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="border-t border-slate-700 p-6">

          <div className="mb-6 flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span className="text-green-400">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            disabled={paying || entries.length === 0}
            className="w-full rounded-xl bg-green-600 py-4 text-lg font-semibold hover:bg-green-500 disabled:opacity-50"
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