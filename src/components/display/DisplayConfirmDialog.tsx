"use client";

type Props = {
  open: boolean;
  title: string;
 message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DisplayConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">

      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 p-10 shadow-2xl">

        <h2 className="text-5xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-8 text-3xl text-slate-300">
          {message}
        </p>

        <div className="mt-12 flex justify-end gap-6">

          <button
            onClick={onCancel}
            className="rounded-2xl bg-slate-700 px-10 py-5 text-2xl font-semibold transition hover:bg-slate-600"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="rounded-2xl bg-green-600 px-10 py-5 text-2xl font-bold transition hover:bg-green-700"
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>
  );
}