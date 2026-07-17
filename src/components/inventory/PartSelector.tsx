type Props = {
  parts: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function PartSelector({
  parts,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-lg font-semibold">

        Part

      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-slate-900
          p-4
          text-xl
        "
      >
        <option value="">

          Select Part...

        </option>

        {parts.map((part) => (

          <option
            key={part}
            value={part}
          >

            {part}

          </option>

        ))}

      </select>

    </div>
  );
}