"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  title: string;
};

export default function PageHeader({ title }: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950">

      <div className="flex items-center justify-between px-8 py-5">

        <div className="flex items-center gap-6">

          <Link
            href="/"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              px-4
              py-2
              text-slate-200
              transition
              hover:border-blue-500
              hover:bg-slate-800
            "
          >
            <ArrowLeft size={18} />
            <Home size={18} />
            Dashboard
          </Link>

          <div>

            <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Aurora Outdoor Furniture
            </div>

            <h1 className="mt-1 text-4xl font-bold">
              {title}
            </h1>

          </div>

        </div>

        <div className="text-3xl font-semibold text-white">
          {time}
        </div>

      </div>

    </header>
  );
}