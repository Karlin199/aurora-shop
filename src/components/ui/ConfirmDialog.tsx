"use client";

import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "green" | "red" | "blue";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "green",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const buttonColor = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
  }[confirmColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">

        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <div className="rounded-full bg-yellow-500/20 p-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-white/10 px-5 py-2 text-white transition hover:bg-white/10"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-5 py-2 font-medium text-white transition ${buttonColor}`}
          >
            {loading ? "Working..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}