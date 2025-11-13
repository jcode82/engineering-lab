"use client";

import React, { useEffect, useState } from "react";
import { useParallaxShift } from "@/hooks/useParallaxShift";

export default function ParallaxBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hook must run at top level
  const rawOffset = useParallaxShift(0.05);

  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({
    background:
      "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.07), transparent 70%)",
  });

  useEffect(() => {
    // Effect runs only in browser
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

    if (prefersReduced) {
      setBgStyle({
        background:
          "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.07), transparent 70%)",
      });
      return;
    }

    const updateBackground = () => {
      const offset = rawOffset ?? 0;

      setBgStyle({
        background: `radial-gradient(
          circle at 50% ${50 + offset * 0.1}%,
          rgba(37,99,235,0.07),
          transparent 70%
        )`,
        transition: "background-position 0.3s ease-out",
      });
    };

    updateBackground();
    window.addEventListener("scroll", updateBackground);
    return () => window.removeEventListener("scroll", updateBackground);
  }, [rawOffset]);

  return (
    <div style={bgStyle} className="min-h-screen">
      {children}
    </div>
  );
}
