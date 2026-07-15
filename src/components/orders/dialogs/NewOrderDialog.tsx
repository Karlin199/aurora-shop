"use client";

import { useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

import ProductRow from "../ProductRow";

import useLookup from "@/hooks/useLookup";

import type { NewOrderProduct } from "@/types/newOrder";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export default function NewOrderDialog({
  open,
  onClose,
  onSaved,
}: Props) {
  const { items: customers } = useLookup("/api/customers");

  const [customer, setCustomer] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [products, setProducts] = useState<NewOrderProduct[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setCustomer("");
    setDueDate("");
    setProducts([]);
    setError("");
  }

  function addProduct() {
    setProducts((current) => [
      ...current,
      {
        id: Date.now(),
        item: "",
        color: "",
        qty: 1,
      },
    ]);
  }

  function updateProduct(updated: NewOrderProduct) {
    setProducts((current) =>
      current.map((product) =>
        product.id === updated.id ? updated : product
      )
    );
  }

  function removeProduct(id: number) {
    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  async function saveOrder() {
    setError("");

    if (!customer) {
      setError("Please select a customer.");
      return;
    }

    if (!dueDate) {
      setError("Please choose a due date.");
      return;
    }

    if (products.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    for (const product of products) {
      if (
        !product.item ||
        !product.color ||
        product.qty < 1
      ) {
        setError("Please complete all product fields.");
        return;
      }
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer,
            dueDate,
            products,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      resetForm();

      await onSaved();

      onClose();
    } catch {
      setError(
        "Unable to save the order. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Customer Order"
    >
      <div className="space-y-6">

        {error && (
          <div className="rounded-xl border border-red-600 bg-red-950 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">

          <Select
            label="Customer"
            value={customer}
            onChange={(e) =>
              setCustomer(e.target.value)
            }
          >
            <option value="">
              Select customer...
            </option>

            {customers.map((customer) => (
              <option
                key={customer.name}
                value={customer.name}
              >
                {customer.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
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

            {products.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-600 p-8 text-center text-slate-500">
                No products added yet.
              </div>
            )}

            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onChange={updateProduct}
                onRemove={() =>
                  removeProduct(product.id)
                }
              />
            ))}

          </div>

        </div>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={saveOrder}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Order"}
          </Button>

        </div>

      </div>

    </Modal>
  );
}