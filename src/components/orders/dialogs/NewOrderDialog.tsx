"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import ProductRow from "../ProductRow";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NewOrderDialog({
  open,
  onClose,
}: Props) {
  const [rows, setRows] = useState<number[]>([]);

  function addProduct() {
    setRows((current) => [...current, Date.now()]);
  }

  function removeProduct(id: number) {
    setRows((current) => current.filter((row) => row !== id));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Customer Order"
    >
      <div className="space-y-6">

        <div className="grid gap-6 md:grid-cols-2">

          <Input
            label="Customer"
            placeholder="Customer name..."
          />

          <Input
            label="Due Date"
            type="date"
          />

        </div>

        <div className="rounded-xl border border-slate-700 p-6">

          <div className="flex items-center justify-between">

            <h3 className="text-lg font-semibold">
              Products
            </h3>

            <Button
              variant="secondary"
              onClick={addProduct}
            >
              + Add Product
            </Button>

          </div>

          <div className="mt-6 space-y-4">

            {rows.length === 0 && (

              <div className="rounded-xl border border-dashed border-slate-600 p-8 text-center text-slate-500">

                No products added yet.

              </div>

            )}

            {rows.map((id) => (

              <ProductRow
                key={id}
                onRemove={() => removeProduct(id)}
              />

            ))}

          </div>

        </div>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button>
            Save Order
          </Button>

        </div>

      </div>
    </Modal>
  );
}