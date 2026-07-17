"use client";

import { useEffect, useMemo, useState } from "react";
import EmployeeBalanceCard from "./EmployeeBalanceCard";
import EmployeeDetailsDrawer from "./EmployeeDetailsDrawer";

type EmployeeBalance = {
  employee: string;
  total: number;
  entries: number;
};

export default function PayrollPage() {
  const [balances, setBalances] = useState<EmployeeBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    loadBalances();
  }, []);

  async function loadBalances() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/payroll/balances");

      if (!response.ok) {
        throw new Error("Unable to load payroll.");
      }

      const data = await response.json();

      setBalances(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalOwing = useMemo(() => {
    return balances.reduce((sum, employee) => sum + employee.total, 0);
  }, [balances]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading payroll...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-8">

      <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">

        <p className="text-sm uppercase tracking-wide text-slate-400">
          Total Outstanding Payroll
        </p>

        <h1 className="mt-2 text-5xl font-bold text-green-400">
          ${totalOwing.toFixed(2)}
        </h1>

        <p className="mt-2 text-slate-400">
          {balances.length} Employee{balances.length === 1 ? "" : "s"} Awaiting Payment
        </p>

      </div>

      {balances.length === 0 ? (
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-12 text-center text-slate-400">
          Everyone has been paid 🎉
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {balances.map((employee) => (
            <EmployeeBalanceCard
              key={employee.employee}
              employee={employee.employee}
              total={employee.total}
              entries={employee.entries}
              onClick={() => setSelectedEmployee(employee.employee)}
            />
          ))}
        </div>
      )}

      <EmployeeDetailsDrawer
       employee={selectedEmployee}
       open={selectedEmployee !== null}
       onClose={() => setSelectedEmployee(null)}
       onPaid={loadBalances}
      />

    </div>
  );
}