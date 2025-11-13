'use client';
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useParallaxShift } from "@/hooks/useParallaxShift";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean; // optional alignment flag
  noBorder?: boolean; // optional border toggle
}

export default function SectionWrapper({
  id,
  children,
  className = "",
  center = false,
  noBorder = false,
}: SectionWrapperProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const baseClasses = `
    relative py-24 md:py-32
    ${noBorder ? "" : "border-b border-[var(--border)]"}
    ${center ? "text-center" : ""}
    bg-[var(--surface)]
    dark:bg-transparent
    transition-colors duration-500
  `;

  const rawOffset = useParallaxShift(0.05);
  const offset = rawOffset ?? 0; // <-- FIX SAFE VALUE
  
  const bg = `linear-gradient(
    180deg,
    rgba(37,99,235,${0.03 + offset / 3000}),
    rgba(34,197,94,${0.03 + offset / 4000})
  )`;

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${baseClasses} ${className} even:bg-[var(--surface)] odd:bg-transparent`}
      style={{ backgroundImage: bg, backgroundBlendMode: "soft-light" }}
    >
      <div className="max-w-4xl mx-auto px-4">{children}</div>
    </motion.section>
  );
}
