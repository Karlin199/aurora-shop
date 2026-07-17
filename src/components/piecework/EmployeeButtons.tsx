type Props = {
  employees: string[];
  value: string;
  onChange: (employee: string) => void;
};

export default function EmployeeButtons({
  employees,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold">
        Who did the work?
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {employees.map((employee) => {

          const selected =
            employee === value;

          return (
            <button
              key={employee}
              onClick={() => onChange(employee)}
              className={`
                rounded-xl
                border
                p-6
                text-xl
                font-semibold
                transition

                ${
                  selected
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-slate-700 bg-slate-900 hover:bg-slate-800"
                }
              `}
            >
              {employee}
            </button>
          );

        })}

      </div>

    </div>
  );
}