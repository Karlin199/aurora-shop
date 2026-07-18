import DisplayPanel from "./DisplayPanel";

type Props = {
  label: string;
  value: React.ReactNode;
};

export default function DisplayMetric({
  label,
  value,
}: Props) {
  return (
    <DisplayPanel className="p-12">

      <div className="text-center">

        <div className="text-3xl font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </div>

        <div className="mt-6 text-9xl font-black">
          {value}
        </div>

      </div>

    </DisplayPanel>
  );
}