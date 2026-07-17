"use client";

import { useEffect, useMemo, useState } from "react";
import InventoryInputCard from "./InventoryInputCard";

type Part = {
  part: string;
  colour: string;
};

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);

  const [selectedPart, setSelectedPart] = useState("");

  const [selectedColour, setSelectedColour] =
    useState("");

  const [quantity, setQuantity] =
    useState(0);

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/parts");
      const data = await res.json();

      setParts(data);
    }

    load();
  }, []);

  const uniqueParts = useMemo(() => {

    return [...new Set(parts.map((p) => p.part))].sort();

  }, [parts]);

  const availableColours = useMemo(() => {

    return parts
      .filter((p) => p.part === selectedPart)
      .map((p) => p.colour)
      .sort();

  }, [parts, selectedPart]);

  function handlePartChange(part: string) {

    setSelectedPart(part);

    setSelectedColour("");

    setQuantity(0);

  }

  async function handleSubmit() {

    try {

      const response = await fetch(
        "/api/inventory/add",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
          },
         body: JSON.stringify({
           part: selectedPart,
           colour: selectedColour,
           quantity,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
       throw new Error(result.error);
      }

      setSuccessMessage(
       `Added ${quantity} ${selectedColour} ${selectedPart}`
      );

      setSelectedPart("");
      setSelectedColour("");
      setQuantity(0);

      setTimeout(() => {
       setSuccessMessage("");
      }, 2500);

    } catch (err) {

      alert(
        err instanceof Error
         ? err.message
         : "Unable to update inventory."
      );

    }

  }

  return (

    <div className="min-h-screen bg-slate-950 p-10 text-white">
      
      {successMessage && (

        <div
         className="
           mx-auto
           mb-6
           max-w-2xl
           rounded-xl
           border
           border-green-700
           bg-green-900/30
           p-5
           text-center
          "
        >

        <div className="text-2xl font-bold text-green-400">

         ✓ Inventory Updated

        </div>

        <div className="mt-2 text-lg">

         {successMessage}

        </div>

      </div>

    )}
    
      <InventoryInputCard

        parts={uniqueParts}

        selectedPart={selectedPart}

        onPartChange={handlePartChange}

        colours={availableColours}

        selectedColour={selectedColour}

        onColourChange={setSelectedColour}

        quantity={quantity}

        onQuantityChange={setQuantity}

        onSubmit={handleSubmit}

      />

    </div>

  );

}