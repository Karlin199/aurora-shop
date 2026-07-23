import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-700 p-6">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-slate-400 transition hover:text-white"
          >
            ×
          </button>

        </div>

        {/* Scrollable Body */}

        <div className="flex-1 overflow-y-auto p-6">

         {children}

        </div>

        {footer && (
          <div className="border-t border-slate-700 bg-slate-900 p-6">
           {footer}
          </div>
        )}

      </div>

    </div>
  );
}