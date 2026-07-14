import { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export default function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg">
      <h2 className="mb-5 text-xl font-semibold text-white">
        {title}
      </h2>

      {children}
    </div>
  );
}