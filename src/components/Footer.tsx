"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 text-center text-gray-500 space-y-2 text-sm">
      <p>© {new Date().getFullYear()} Juan Flores. All rights reserved.<span> - <Link
          href="/privacy"
          className="text-primary-200 hover:text-primary-200 transition"
        >
          Privacy
        </Link></span>
      </p>
    </footer>
  );
}
