"use client";
import { useEffect, useState } from "react";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

export default function ScrollTracker() {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotionPref();

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(0);
      return;
    }

    const selector = "[data-article-root='true']";
    const findArticle = () =>
      document.querySelector<HTMLElement>(selector) ?? null;

    let target = findArticle();
    let frame: number | null = null;

    const calculateProgress = () => {
      const article = target;
      if (article) {
        const rect = article.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = article.offsetHeight;
        const viewportHeight = window.innerHeight;
        const start = articleTop - viewportHeight * 0.15;
        const end = articleTop + articleHeight - viewportHeight;
        const distance = Math.max(end - start, 1);
        const raw = (window.scrollY - start) / distance;
        return Math.min(Math.max(raw, 0), 1) * 100;
      }

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(Math.max(window.scrollY / docHeight, 0), 1) * 100;
    };

    const updateProgress = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setProgress(calculateProgress());
      });
    };

    const handleScroll = () => updateProgress();
    const handleResize = () => updateProgress();

    const observer = new MutationObserver(() => {
      target = findArticle();
      updateProgress();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    updateProgress();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] bg-primary-500 transition-[width] duration-100 z-[9999]"
      style={{ width: `${progress}%` }}
    />
  );
}
