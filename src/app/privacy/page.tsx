export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4 space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-primary-200">
          Privacy
        </p>
        <h1 className="text-4xl font-bold">How this site handles analytics</h1>
        <p className="text-base text-muted-foreground">
          A simple overview of what is collected, why, and what is never stored.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What is collected</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>The page path that was viewed (e.g., /experiments/chaos-room)</li>
          <li>A hashed version of the visitor&apos;s IP (one-way SHA-256)</li>
          <li>The browser user-agent string</li>
          <li>The timestamp of the request</li>
        </ul>
        <p className="text-sm opacity-75">
          IP addresses are never stored in plain text. They are hashed immediately
          and used only to estimate how many unique visitors the site receives.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What is not collected</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>No cookies or tracking pixels</li>
          <li>No session replay, heatmaps, or behavioral fingerprinting</li>
          <li>No Google Analytics or third-party analytics packages</li>
          <li>No sharing or selling of analytics data</li>
        </ul>
      </section>

      <section className="space-y-3 text-sm">
        <h2 className="text-xl font-semibold">Why this data is collected</h2>
        <p>
          The Engineering Lab is an evolving portfolio of experiments. Knowing
          which sections attract the most attention makes it easier to prioritize
          improvements, add new experiments, and share more of what people find
          useful. The analytics are strictly internal.
        </p>
      </section>

      <section className="space-y-3 text-sm">
        <h2 className="text-xl font-semibold">Questions</h2>
        <p>
          If you have questions or want to know more about how analytics are
          handled, feel free to reach out via the contact section.
        </p>
      </section>
    </main>
  );
}
