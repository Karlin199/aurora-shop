"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
};

export default function DisplaySuccessDialog({
  open,
  title = "Completed!",
  message = "Order marked complete.",
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">

      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 p-12 text-center shadow-2xl">

        <CheckCircle2 className="mx-auto h-28 w-28 text-green-500" />

        <h2 className="mt-8 text-6xl font-bold">
          {title}
        </h2>

        <p className="mt-6 text-3xl text-slate-300">
          {message}
        </p>

      </div>

    </div>
  );
}