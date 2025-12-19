"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_SECTIONS = ["experiments", "notes", "case-studies", "about", "contact"] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  // Memoize section IDs to keep dependency stable
  const sections = useMemo(
    () => ["hero", ...NAV_SECTIONS],
    []
  );

  // Highlight active section while scrolling
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  // Detect scroll for fade-blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkBase =
    "transition-colors duration-200 hover:text-primary-500 capitalize";
  const labelMap: Record<string, string> = {
    "case-studies": "case studies",
  };

  const makeLink = (id: string) => (
    <Link
      key={id}
      href={`/#${id}`}
      onClick={() => setOpen(false)}
      className={`${linkBase} ${
        active === id ? "text-primary-500 font-semibold" : "text-foreground"
      }`}
      scroll
    >
      {labelMap[id] ?? id}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] transition-all duration-500
        flex items-center justify-between px-6 py-4
        ${
          scrolled
            ? "bg-[var(--background)]/90 backdrop-blur-md shadow-sm"
            : "bg-[var(--background)]/50 backdrop-blur-none"
        }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/lab-icon.png"
          alt="Engineering Lab Icon"
          width={50}
          height={50}
          className="translate-y-[1px]"
          priority
        />
        <span className="text-xl font-semibold tracking-tight">
          Juan <span className="text-primary-500">Flores</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-4">
        {NAV_SECTIONS.map((id) => makeLink(id))}
        <ThemeToggle />
      </nav>

      {/* Mobile controls */}
      <div className="md:hidden flex items-center space-x-2">
        <ThemeToggle />
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="absolute top-16 right-4 bg-[var(--surface)] 
                     rounded-md shadow-lg border border-[var(--border)]
                     flex flex-col space-y-2 p-4 md:hidden"
        >
          {NAV_SECTIONS.map((id) => makeLink(id))}
        </div>
      )}
    </header>
  );
}
