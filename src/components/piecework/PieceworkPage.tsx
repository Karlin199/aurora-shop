"use client";

import { useEffect, useMemo, useState } from "react";

import QuantitySelector from "@/components/inventory/QuantitySelector";

type Employee = {
  name: string;
};

type PieceJob = {
  job: string;
  rate: number;
  unit: string;
};

type SuccessPopup = {
  employee: string;
  job: string;
  quantity: number;
  earned: number;
};

export default function PieceworkPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobs, setJobs] = useState<PieceJob[]>([]);

  const [employee, setEmployee] = useState("");
  const [job, setJob] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [saving, setSaving] = useState(false);

  const [success, setSuccess] =
    useState<SuccessPopup | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [employeeRes, jobRes] =
          await Promise.all([
            fetch("/api/employees"),
            fetch("/api/piece-jobs"),
          ]);

        if (!employeeRes.ok || !jobRes.ok) {
          throw new Error(
            "Unable to load piecework data."
          );
        }

        setEmployees(await employeeRes.json());
        setJobs(await jobRes.json());
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load employees or jobs."
        );
      }
    }

    loadData();
  }, []);

  const selectedJob = useMemo(() => {
    return jobs.find(
      (j) => j.job === job
    );
  }, [jobs, job]);

  const estimatedPay = useMemo(() => {
    if (!selectedJob) return 0;

    return quantity * selectedJob.rate;
  }, [selectedJob, quantity]);

  async function saveEntry() {
    if (!employee) return;

    if (!job) return;

    if (quantity <= 0) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/piecework/add",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            employee,
            job,
            quantity,
          }),
        }
      );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.error ??
            "Unable to save entry."
        );
      }

      setSuccess({
        employee,
        job,
        quantity,
        earned: Number(result.earned),
      });

      setEmployee("");
      setJob("");
      setQuantity(1);

      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save entry."
      );
    } finally {
      setSaving(false);
    }
  }

    return (
    <>
      <div className="mx-auto max-w-3xl space-y-5">

        <div>
          <h1 className="text-3xl font-bold">
            Piecework
          </h1>
        </div>

        {error && (
          <div className="rounded-xl border border-red-700 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-lg font-medium">
            Employee
          </label>

          <select
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              p-4
              text-lg
            "
          >
            <option value="">
              Select employee...
            </option>

            {employees.map((employee) => (
              <option
                key={employee.name}
                value={employee.name}
              >
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-lg font-medium">
            Job
          </label>

          <select
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              p-4
              text-lg
            "
          >
            <option value="">
              Select job...
            </option>

            {jobs.map((job) => (
              <option
                key={job.job}
                value={job.job}
              >
                {job.job}
              </option>
            ))}
          </select>
        </div>

        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
        />

        {selectedJob && (
          <div className="rounded-2xl border border-green-700 bg-green-950 p-4">

            <div className="text-sm uppercase tracking-wider text-green-300">
              Estimated Pay
            </div>

            <div className="mt-1 text-4xl font-bold text-green-400">
              ${estimatedPay.toFixed(2)}
            </div>

          </div>
        )}

        <button
          onClick={saveEntry}
          disabled={
            saving ||
            !employee ||
            !job
          }
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-4
            text-2xl
            font-semibold
            transition
            hover:bg-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving ? "Saving..." : "Save"}
        </button>

      </div>

      {success && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
          "
        >
          <div
            className="
              w-full
              max-w-xl
              rounded-3xl
              border
              border-green-600
              bg-slate-900
              p-10
              text-center
              shadow-2xl
            "
          >
            <div className="mb-4 text-7xl">
              ✅
            </div>

            <h2 className="text-4xl font-bold">
              Great Job!
            </h2>

            <p className="mt-2 text-xl text-slate-400">
              Your work has been recorded.
            </p>

            <div className="mt-8 space-y-3">

              <div className="text-2xl font-semibold">
                {success.employee}
              </div>

              <div className="text-xl text-slate-400">
                {success.job}
              </div>

              <div className="text-xl">
                Quantity: {success.quantity}
              </div>

            </div>

            <div className="mt-10">

              <div className="text-lg text-slate-400">
                Earned
              </div>

              <div className="mt-2 text-6xl font-bold text-green-400">
                ${success.earned.toFixed(2)}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}