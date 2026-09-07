"use client";

import { Children, ReactNode } from "react";

type Props = {
  index: number;
  children: ReactNode;
};

export default function DisplayCarousel({
  index,
  children,
}: Props) {
  const slides = Children.toArray(children);
  const totalSlides = slides.length;

  if (totalSlides === 0) {
    return null;
  }

  const slideWidth = 100 / totalSlides;
  const translateAmount = index * slideWidth;

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${translateAmount}%)`,
        }}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            className="min-h-[calc(100vh-220px)] flex-shrink-0"
            style={{
              width: `${slideWidth}%`,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}