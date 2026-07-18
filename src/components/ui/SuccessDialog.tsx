"use client";

import { CheckCircle2 } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export default function SuccessDialog({
  open,
  title,
  message,
  buttonText = "Continue",
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#101827] p-8 text-center shadow-2xl">

        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

        <h2 className="mt-5 text-2xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-3 text-gray-400">
          {message}
        </p>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-green-600 py-3 text-white transition hover:bg-green-700"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}