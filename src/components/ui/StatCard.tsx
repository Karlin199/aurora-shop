import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  subtitle?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-6 shadow-lg transition hover:border-slate-500 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-sm uppercase tracking-wide">
          {title}
        </div>

        <div className="text-slate-400">
          {icon}
        </div>
      </div>

      <div className="mt-4 text-5xl font-bold text-white">
        {value}
      </div>

      {subtitle && (
        <div className="mt-3 text-sm text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}