"use client";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  // IDs must match your SectionWrapper ids
  const sections = ["hero", "projects", "notes", "about", "contact"];

  // Highlight active section
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkBase =
    "transition-colors duration-200 hover:text-primary-500 capitalize";

  const makeLink = (id: string) => (
    <a
      key={id}
      href={`#${id}`}
      onClick={() => setOpen(false)}
      className={`${linkBase} ${
        active === id ? "text-primary-500 font-semibold" : "text-foreground"
      }`}
    >
      {id}
    </a>
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
      <h1 className="text-lg font-semibold">Juan Flores</h1>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center space-x-4">
        {sections.slice(1).map((id) => makeLink(id))}
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
        <div className="absolute top-16 right-4 bg-[var(--surface)] 
                        rounded-md shadow-lg border border-[var(--border)]
                        flex flex-col space-y-2 p-4 md:hidden">
          {sections.slice(1).map((id) => makeLink(id))}
        </div>
      )}
    </header>
  );
}
