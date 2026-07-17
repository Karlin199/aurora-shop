type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CNCSearch({
  value,
  onChange,
}: Props) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search CNC files..."
        className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          px-5
          py-4
          text-lg
          text-white
          placeholder:text-slate-500
          focus:border-blue-500
          focus:outline-none
        "
      />
    </div>
  );
}