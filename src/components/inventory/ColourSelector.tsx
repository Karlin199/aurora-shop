type Props = {
  colours: string[];
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function ColourSelector({
  colours,
  value,
  disabled = false,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-lg font-semibold">

        Colour

      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-lg
          border
          border-slate-700
          bg-slate-900
          p-4
          text-xl
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <option value="">

          Select Colour...

        </option>

        {colours.map((colour) => (

          <option
            key={colour}
            value={colour}
          >

            {colour}

          </option>

        ))}

      </select>

    </div>
  );
}