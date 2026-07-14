import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    danger:
      "bg-red-600 hover:bg-red-500 text-white",
  };

  return (
    <button
      {...props}
      className={`
        rounded-xl
        px-5
        py-3
        font-medium
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}