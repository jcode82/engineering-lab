"use client";

import Image from "next/image";
// import SectionWrapper from "./SectionWrapper";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] grid grid-cols-1 md:grid-cols-2">
      
      {/* Left: portrait */}
      <div className="relative h-[50vh] md:h-auto">
        <Image
          src="/images/juan.jpg"
          alt="Juan Flores"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: text */}
      <div className="flex flex-col justify-center px-8 py-16 md:px-16 bg-[var(--surface)]">
        <Reveal>
        <h1 className="text-5xl md:text-6xl font-extrabold
               bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent
               drop-shadow-[0_0_6px_rgba(37,99,235,0.25)]">
          Engineering<br/><span className="text-primary-500">Lab</span>
        </h1>
        </Reveal>

        <div className="w-24 h-[1px] bg-white/30 my-6"></div>

        {/* <h3 className="max-w-md text-lg text-white/70">
          Experiments in performance, systems, and creative technology.
        </h3> */}
        <Reveal>
            <p className="text-base max-w-2xl mx-auto">
                A collection of experiments and notes that showcases my work.
            </p>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex gap-4">
            <a
              href="/#projects"
              className="px-6 py-3 rounded-lg bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/30 transition hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            >
              Explore
            </a>
            <a
              href="/#about"
              className="px-6 py-3 rounded-lg border border-[var(--border)] text-foreground transition hover:bg-black/5 dark:border-white/40 dark:text-white dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            >
              About Me
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
