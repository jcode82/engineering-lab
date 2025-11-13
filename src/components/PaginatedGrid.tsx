"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

interface PaginatedGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  perPage?: number;
  mode?: "load-more" | "infinite";
}

export default function PaginatedGrid<T>({
  items,
  renderItem,
  perPage = 6,
  mode = "load-more",
}: PaginatedGridProps<T>) {
  const [visible, setVisible] = useState(perPage);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = visible < items.length;
  
  //const handleLoadMore = () => setVisible((v) => v + perPage);
  
  //optional scroll into view
  
  const handleLoadMore = () => {
        setVisible((v) => v + perPage);
        setTimeout(() => {
            window.scrollBy({ top: 200, behavior: "smooth" });
        }, 100);
    };

  // Observe bottom for infinite scroll
  useEffect(() => {
    if (mode !== "infinite" || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && handleLoadMore(),
      { rootMargin: "200px" }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [mode, hasMore]);

  const visibleItems = items.slice(0, visible);

  const prefersReduced = useReducedMotionPref();

  return (
    <>
      <div className="grid gap-8 mt-8">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, i) =>
            prefersReduced ? (
              <div key={i}>{renderItem(item)}</div>
            ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
              layout
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {mode === "load-more" && hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 rounded-md border border-[var(--border)]
                       bg-[var(--surface)] hover:border-primary-400
                       text-sm font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {mode === "infinite" && hasMore && <div ref={sentinelRef} className="h-8" />}
    </>
  );
}
