"use client";

import React from "react";
import { useParallaxShift } from "@/hooks/useParallaxShift";

export default function ParallaxBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawOffset = useParallaxShift(0.05);
  const offset = rawOffset ?? 0;

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const bgStyle: React.CSSProperties = prefersReduced
    ? {
        background:
          "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.07), transparent 70%)",
      }
    : {
        background: `radial-gradient(
          circle at 50% ${50 + offset * 0.1}%,
          rgba(37,99,235,0.07),
          transparent 70%
        )`,
        transition: "background-position 0.3s ease-out",
      };

  return (
    <div style={bgStyle} className="min-h-screen">
      {children}
    </div>
  );
}
