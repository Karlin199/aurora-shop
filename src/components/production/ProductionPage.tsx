"use client";

import { useEffect, useState } from "react";
import MachineTable from "./MachineTable";
import MachineTabs from "./MachineTabs";

type ProductionColour = {
  colour: string;

  required: number;
  inStock: number;
  toCut: number;

  cncFile: string;
  partsPerBoard: number;
  boardsRequired: number;
};

type ProductionGroup = {
  part: string;
  colours: ProductionColour[];
};

type ProductionMachine = {
  machine: string;
  parts: ProductionGroup[];
};

export default function ProductionPage() {
  const [machines, setMachines] =
    useState<ProductionMachine[]>([]);

  const [selectedMachine, setSelectedMachine] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [time, setTime] = useState("");

  useEffect(() => {
    async function load() {
      const res =
        await fetch("/api/production");

      const data =
        await res.json();

      setMachines(data);

      if (data.length > 0) {
       setSelectedMachine(data[0].machine);
      }

      setLoading(false);
    }

    load();

    const interval = setInterval(() => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-xl">
        Loading Production...
      </div>
    );
  }
  
  const currentMachine = machines.find(
   (m) => m.machine === selectedMachine
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-700 px-8 py-5">

        <div className="text-2xl font-bold tracking-wide">

          Aurora Production

        </div>

        <div className="text-2xl font-semibold text-slate-300">

          {time}

        </div>

      </div>

      {/* Production */}

      <div className="px-8 py-6">
        
        <MachineTabs
         machines={machines.map((m) => m.machine)}
         selected={selectedMachine}
         onSelect={setSelectedMachine}
        />

        {machines.length === 0 ? (

          <div className="py-20 text-center text-3xl font-semibold text-green-400">

            Everything is Cut ✔

          </div>

        ) : (

          currentMachine && (

           <MachineTable
             machine={currentMachine.machine}
             parts={currentMachine.parts}
            />

          )

        )}

      </div>

    </div>
  );
}