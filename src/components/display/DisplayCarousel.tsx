"use client";

import { ReactNode } from "react";

type Props = {
  index: number;
  children: ReactNode[];
};

export default function DisplayCarousel({
  index,
  children,
}: Props) {
  return (
    <div className="overflow-hidden">

      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="min-h-[calc(100vh-220px)] w-full flex-shrink-0"
          >
            {child}
          </div>
        ))}
      </div>

    </div>
  );
}