"use client";
import React from "react";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, activeTag, onTagChange }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
      <button
        onClick={() => onTagChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm border transition-colors
          ${activeTag === null
            ? "bg-primary-500 text-white border-primary-500"
            : "bg-[var(--surface)] border-[var(--border)] hover:border-primary-400"}`}
      >
        All
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag === activeTag ? null : tag)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors
            ${activeTag === tag
              ? "bg-primary-500 text-white border-primary-500"
              : "bg-[var(--surface)] border-[var(--border)] hover:border-primary-400"}`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
