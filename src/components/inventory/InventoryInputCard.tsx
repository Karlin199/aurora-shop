import PartSelector from "./PartSelector";
import ColourSelector from "./ColourSelector";
import QuantitySelector from "./QuantitySelector";

type Props = {
  parts: string[];

  selectedPart: string;
  onPartChange: (value: string) => void;

  colours: string[];

  selectedColour: string;
  onColourChange: (value: string) => void;

  quantity: number;
  onQuantityChange: (value: number) => void;

  onSubmit: () => void;
};

export default function InventoryInputCard({
  parts,
  selectedPart,
  onPartChange,

  colours,
  selectedColour,
  onColourChange,

  quantity,
  onQuantityChange,

  onSubmit,
}: Props) {
  return (
    <div
      className="
        mx-auto
        max-w-2xl
        rounded-2xl
        border
        border-slate-700
        bg-slate-900
        p-8
        shadow-xl
      "
    >
      <h1 className="mb-8 text-center text-3xl font-bold">
        Inventory Input
      </h1>

      <div className="space-y-8">

        <PartSelector
          parts={parts}
          value={selectedPart}
          onChange={onPartChange}
        />

        <ColourSelector
          colours={colours}
          value={selectedColour}
          disabled={!selectedPart}
          onChange={onColourChange}
        />

        <QuantitySelector
          value={quantity}
          onChange={onQuantityChange}
        />

        <button
          onClick={onSubmit}
          disabled={
            !selectedPart ||
            !selectedColour ||
            quantity <= 0
          }
          className="
            w-full
            rounded-xl
            bg-blue-600
            py-5
            text-2xl
            font-bold
            transition
            hover:bg-blue-500
            disabled:cursor-not-allowed
            disabled:bg-slate-700
            disabled:text-slate-400
          "
        >
          Add Inventory
        </button>

      </div>
    </div>
  );
}