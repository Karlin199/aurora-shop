"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import useLookup from "@/hooks/useLookup";

import type { NewOrderProduct } from "@/types/newOrder";

type Props = {
  product: NewOrderProduct;
  onChange: (product: NewOrderProduct) => void;
  onRemove: () => void;
};

export default function ProductRow({
  product,
  onChange,
  onRemove,
}: Props) {
  const { items: products } = useLookup("/api/products");
  const { items: colours } = useLookup("/api/colours");

  return (
    <div className="rounded-xl border border-slate-700 p-5 space-y-4">

      <div className="grid gap-4 md:grid-cols-3">

        <Select
          label="Product"
          value={product.item}
          onChange={(e) =>
            onChange({
              ...product,
              item: e.target.value,
            })
          }
        >
          <option value="">Select a product...</option>

          {products.map((item) => (
            <option
              key={item.name}
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </Select>

        <Select
          label="Colour"
          value={product.color}
          onChange={(e) =>
            onChange({
              ...product,
              color: e.target.value,
            })
          }
        >
          <option value="">Select a colour...</option>

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
          value={product.qty}
          min={1}
          onChange={(e) =>
            onChange({
              ...product,
              qty: Number(e.target.value),
            })
          }
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