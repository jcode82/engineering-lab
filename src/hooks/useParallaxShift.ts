"use client";
import { useEffect, useState } from "react";

export function useParallaxShift(strength = 0.15) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      setOffset(scrollY * strength);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [strength]);
  
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches) return; // disable effect entirely

  // offset is a small float you can map into transforms or color stops
  return offset;
}
