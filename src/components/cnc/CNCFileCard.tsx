type Props = {
  part: string;
  file: string;
  modified: string;
  onDownload: () => void;
};

export default function CNCFileCard({
  part,
  file,
  modified,
  onDownload,
}: Props) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-700
        bg-slate-900
        p-5
      "
    >
      <div className="space-y-1">

        <h3 className="text-2xl font-semibold">
          {part}
        </h3>

        <p className="text-slate-300">
          {file}
        </p>

        {modified && (
          <p className="text-sm text-slate-500">
            Updated {modified}
          </p>
        )}

      </div>

      <button
        onClick={onDownload}
        className="
          rounded-lg
          bg-blue-600
          px-6
          py-3
          font-semibold
          transition
          hover:bg-blue-500
        "
      >
        Download
      </button>

    </div>
  );
}