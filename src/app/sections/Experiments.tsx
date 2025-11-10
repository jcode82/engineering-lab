// "use client";
// import { useState, useEffect } from "react";
// import SectionWrapper from "@/components/SectionWrapper";

// export default function Experiments() {
//   const [latency, setLatency] = useState<number | null>(null);

//   useEffect(() => {
//     const start = performance.now();
//     fetch("/api/ping")
//       .then(() => setLatency(Math.round(performance.now() - start)))
//       .catch(() => setLatency(null));
//   }, []);

//   return (
//     <SectionWrapper id="experiments" center>
//       <h3 className="text-3xl md:text-4xl font-semibold mb-6">
//         Latency Playground
//       </h3>
//       {latency !== null ? (
//         <p>Round-trip latency: <strong>{latency} ms</strong></p>
//       ) : (
//         <p className="text-gray-500">Measuring…</p>
//       )}
//     </SectionWrapper>
//   );
// }

import SectionWrapper from "@/components/SectionWrapper";
import { getAllExperiments, type ExperimentMeta } from "@/lib/mdx";

export default function Experiments() {
  const experiments: ExperimentMeta[] = getAllExperiments();

  return (
    <SectionWrapper id="projects">
      <h2 className="text-h2 heading-spacing">Experiments</h2>
      <div className="grid gap-8 mt-8">
        {experiments.map((exp) => (
          <article
            key={exp.slug}
            className="border border-[var(--border)] p-6 rounded-lg hover:border-primary-400 transition-colors"
          >
            <h3 className="text-h3 mb-2">{exp.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{exp.date}</p>
            <p className="text-base">{exp.excerpt}</p>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
