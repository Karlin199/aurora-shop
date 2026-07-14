import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({
  label,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm text-slate-400">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-950
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-500
          ${className}
        `}
      />

    </div>
  );
}