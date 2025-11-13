"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

// T MUST at least have slug?: string
interface PaginatedGridProps<T extends { slug?: string }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  perPage?: number;
  mode?: "load-more" | "infinite";
}

export default function PaginatedGrid<T extends { slug?: string }>({
  items,
  renderItem,
  perPage = 6,
  mode = "load-more",
}: PaginatedGridProps<T>) {
  const [visible, setVisible] = useState(perPage);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = visible < items.length;
  const prefersReduced = useReducedMotionPref();

  // ----------------------------------------
  // Load More (memoized + smooth scroll)
  // ----------------------------------------
  const handleLoadMore = useCallback(() => {
    setVisible((v) => v + perPage);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollBy({ top: 200, behavior: "smooth" });
      }
    }, 100);
  }, [perPage]);

  // ----------------------------------------
  // Infinite Scroll Observer
  // ----------------------------------------
  useEffect(() => {
    if (mode !== "infinite" || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [mode, hasMore, handleLoadMore]);

  const visibleItems = items.slice(0, visible);

  return (
    <>
      {/* Grid */}
      <div className="grid gap-8 mt-8">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, index) => {
            const key = item.slug ? `item-${item.slug}` : `idx-${index}`;

            if (prefersReduced) {
              return <div key={key}>{renderItem(item)}</div>;
            }

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                layout
              >
                {renderItem(item)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
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

      {/* Infinite Scroll Sentinel */}
      {mode === "infinite" && hasMore && (
        <div ref={sentinelRef} className="h-10" />
      )}
    </>
  );
}
