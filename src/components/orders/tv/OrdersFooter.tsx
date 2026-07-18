"use client";

import { ChevronLeft, ChevronRight, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

import { useDisplaySettings } from "@/components/display/DisplayContext";

type Props = {
  currentIndex: number;
  totalOrders: number;
};

export default function OrdersFooter({
  currentIndex,
  totalOrders,
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

        <div className="flex items-center gap-3 text-3xl text-slate-300">
          <ChevronLeft className="h-8 w-8" />
          Previous
        </div>

        {/* Current */}

        <div className="text-4xl font-bold">
          {currentIndex === 0
            ? "Overview"
            : `Order ${currentIndex} of ${totalOrders}`}
        </div>

        {/* Next */}

        <div className="flex items-center gap-3 text-3xl text-slate-300">
          Next
          <ChevronRight className="h-8 w-8" />
        </div>

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