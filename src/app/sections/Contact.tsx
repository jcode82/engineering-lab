import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <Reveal>
        <h2 className="text-h2 heading-spacing">Contact</h2>
      </Reveal>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <p className="text-base">
          Whether you want to collaborate, talk engineering, or dig into one of
          the experiments here, feel free to reach out anytime. I’m always up
          for meaningful conversations and interesting technical problems.
        </p>

        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-[var(--border)]/70 bg-[var(--surface)]/80 dark:bg-black/40 shadow-lg shadow-black/5">
          <span className="text-2xl" aria-hidden>
            📧
          </span>
          <a
            href="mailto:jflifestyles@gmail.com"
            className="text-lg font-semibold tracking-tight hover:text-primary-400 transition"
          >
            jflifestyles@gmail.com
          </a>
        </div>

        <p className="text-sm opacity-70">
          Prefer async updates? Drop me a note and I’ll reply within a day.
        </p>
      </div>
    </SectionWrapper>
  );
}
