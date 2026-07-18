import DisplayPanel from "./DisplayPanel";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function DisplayCard({
  title,
  children,
}: Props) {
  return (
    <DisplayPanel className="overflow-hidden">

      {title && (
        <div className="border-b border-slate-800 px-10 py-6">
          <h2 className="text-3xl font-bold">
            {title}
          </h2>
        </div>
      )}

      <div className="p-10">
        {children}
      </div>

    </DisplayPanel>
  );
}