type Props = {
  machines: string[];
  selected: string;
  onSelect: (machine: string) => void;
};

export default function MachineTabs({
  machines,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">

      {machines.map((machine) => {

        const active = machine === selected;

        return (
          <button
            key={machine}
            onClick={() => onSelect(machine)}
            className={`
              rounded-lg
              px-6
              py-3
              text-lg
              font-semibold
              transition-all
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            {machine}
          </button>
        );

      })}

    </div>
  );
}