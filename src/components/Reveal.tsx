"use client";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  once?: boolean;
  variants?: Variants;
}

export default function Reveal({
  children,
  delay = 0,
  once = true,
  variants,
}: RevealProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: once, threshold: 0.2 });
  const prefersReduced = useReducedMotionPref();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // Short-circuit motion if reduced-motion
  if (prefersReduced) {
    return <div ref={ref}>{children}</div>;
  }

  const defaultVariants: Variants = variants || {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay },
    },
  };

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={defaultVariants}>
      {children}
    </motion.div>
  );
}
