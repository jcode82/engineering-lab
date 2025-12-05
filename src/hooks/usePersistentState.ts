"use client";
import { useState, useEffect } from "react";

export function usePersistentState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      /* ignore */
    }
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [key, value]);

  return [value, setValue];
}
