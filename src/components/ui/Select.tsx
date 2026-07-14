import { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export default function Select({
  label,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm text-slate-400">
          {label}
        </label>
      )}

      <select
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
      >
        {children}
      </select>

    </div>
  );
}