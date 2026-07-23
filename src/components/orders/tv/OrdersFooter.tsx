"use client";

import { ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

import { useDisplaySettings } from "@/components/display/DisplayContext";

type Props = {
  currentIndex: number;
  totalOrders: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function OrdersFooter({
  currentIndex,
  totalOrders,
  onPrevious,
  onNext,
}: Props) {
  const { settings } = useDisplaySettings();

  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="mt-14 border-t border-slate-700 pt-6">

      <div className="flex items-center justify-between">

        {/* Previous */}

        <button
         onClick={onPrevious}
         className="flex items-center gap-3 rounded-xl px-4 py-2 text-3xl text-slate-300 transition hover:bg-slate-800"
        >
         <ChevronLeft className="h-8 w-8" />
         Previous
        </button>

        {/* Current */}

        <div className="text-4xl font-bold">
          {currentIndex === 0
            ? "Overview"
            : `Order ${currentIndex} of ${totalOrders}`}
        </div>

        {/* Next */}

        <button
         onClick={onNext}
         className="flex items-center gap-3 rounded-xl px-4 py-2 text-3xl text-slate-300 transition hover:bg-slate-800"
        >
         <ChevronRight className="h-8 w-8" />
         Next
        </button>

      </div>

      <div className="mt-6 flex items-center justify-between text-xl text-slate-400">

        <div className="flex items-center gap-3">
          <Wifi className="h-5 w-5 text-green-500" />
          Connected
        </div>

        <div>
          Auto Refresh: {settings.refresh} sec
        </div>

        <div>
          Last Updated: {time}
        </div>

      </div>

    </footer>
  );
}