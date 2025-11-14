"use client";

import { useEffect, useState } from "react";

export function useParallaxShift(intensity = 0.05) {
  const [offset, setOffset] = useState(0); // never reference window here!

  useEffect(() => {
    // Safe gate: runs only in browser
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      setOffset(scrollY * intensity);
    };

    handleScroll(); // initial update

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [intensity]);

  return offset;
}
