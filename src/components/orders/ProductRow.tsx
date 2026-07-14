"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import useLookup from "@/hooks/useLookup";

type Props = {
  onRemove: () => void;
};

export default function ProductRow({
  onRemove,
}: Props) {
  const { items: products } = useLookup("/api/products");
  const { items: colours } = useLookup("/api/colours");
  return (
    <div className="rounded-xl border border-slate-700 p-5 space-y-4">

      <div className="grid gap-4 md:grid-cols-3">

        <Select label="Product">
         {products.map((product) => (
           <option
             key={product.name}
             value={product.name}
            >
             {product.name}
            </option>
          ))}
        </Select>

        <Select label="Colour">
          {colours.map((colour) => (
            <option
              key={colour.name}
              value={colour.name}
            >
              {colour.name}
            </option>
          ))}
        </Select>

        <Input
          label="Quantity"
          type="number"
          defaultValue={1}
          min={1}
        />

      </div>

      <div className="flex justify-end">

        <Button
          variant="danger"
          onClick={onRemove}
        >
          Remove Product
        </Button>

      </div>

    </div>
  );
}