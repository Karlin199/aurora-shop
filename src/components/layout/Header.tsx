"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleString("en-CA", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-8">

      <div>
        <h1 className="text-xl font-bold text-white">
          Aurora Outdoor Furniture
        </h1>

        <p className="text-sm text-slate-400">
          Production Management
        </p>
      </div>

      <div className="text-right">
        <div className="text-6xl font-bold leading-none text-white">
         {currentTime}
        </div>
      </div>

    </header>
  );
}