"use client";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
      <h1 className="text-lg font-semibold">Juan Flores</h1>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <a href="#projects" className="hover:text-primary-500">Projects</a>
        <a href="#about" className="hover:text-primary-500">About</a>
        <a href="#contact" className="hover:text-primary-500">Contact</a>
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
          <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
          <a href="#about" onClick={() => setOpen(false)}>About</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  );
}
