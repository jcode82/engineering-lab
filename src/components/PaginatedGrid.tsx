"use client";
import React, { useState, useEffect, useRef } from "react";

interface PaginatedGridProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  perPage?: number;
  mode?: "load-more" | "infinite"; // NEW
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

  // ✅ Infinite scroll observer
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

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mode, hasMore]);

  return (
    <>
      <div className="grid gap-8 mt-8">
        {items.slice(0, visible).map((item, i) => (
          <React.Fragment key={i}>{renderItem(item)}</React.Fragment>
        ))}
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
