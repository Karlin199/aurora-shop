type Props = {
  value: number;
  onChange: (value: number) => void;
};

const presets = [1, 2, 5, 10, 20, 50];

export default function QuantitySelector({
  value,
  onChange,
}: Props) {
  function increase(amount: number) {
    onChange(value + amount);
  }

  function decrease() {
    if (value > 0) {
      onChange(value - 1);
    }
  }

  function increaseOne() {
    onChange(value + 1);
  }
  
  function resetQuantity() {
   onChange(1);
  }

  return (
    <div className="space-y-5">

      <label className="text-lg font-semibold">
        Quantity
      </label>

      {/* Main Counter */}

      <div className="flex items-center justify-center gap-4">

        <button
          onClick={decrease}
          className="
            h-16
            w-16
            rounded-xl
            bg-slate-800
            text-4xl
            font-bold
            hover:bg-slate-700
          "
        >
          −
        </button>

        <div
          className="
            min-w-[140px]
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            py-4
            text-center
            text-5xl
            font-bold
          "
        >
          {value}
        </div>

        <button
          onClick={increaseOne}
          className="
            h-16
            w-16
            rounded-xl
            bg-blue-600
            text-4xl
            font-bold
            hover:bg-blue-500
          "
        >
          +
        </button>

        <button
         onClick={resetQuantity}
         className="
           rounded-xl
           border
           border-slate-600
           bg-slate-800
           px-5
           py-3
           text-base
           font-semibold
           text-slate-200
           transition
           hover:bg-slate-700
         "
        >
         ↺ Reset
        </button>

      </div>

      {/* Quick Add Buttons */}

      <div className="grid grid-cols-3 gap-3">

        {presets.map((amount) => (

          <button
            key={amount}
            onClick={() => increase(amount)}
            className="
              rounded-xl
              bg-slate-800
              py-4
              text-2xl
              font-semibold
              hover:bg-slate-700
            "
          >
            +{amount}
          </button>

        ))}

      </div>

    </div>
  );
}