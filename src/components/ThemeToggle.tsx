"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // tiny icon library

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as ThemeMode | null) || "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const toggle = () => {
    const newTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggle}
      className="rounded-md p-2 transition-colors
                 text-gray-600 hover:bg-gray-100
                 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
