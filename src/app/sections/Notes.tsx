import SectionWrapper from "@/components/SectionWrapper";

export default function Notes() {
  return (
    <SectionWrapper id="notes">
      <h2 className="text-h2 heading-spacing">Notes</h2>
      <p className="text-base max-w-2xl mx-auto">
        A space for thoughts, essays, or experiments.
      </p>
      <article className="prose prose-slate lg:prose-lg mx-auto py-24">
        <h1 className="text-3xl md:text-4xl font-semibold mb-6">The Science of Latency</h1>
        <p>
          Latency is the hidden heartbeat of every networked system.
          Measuring it, visualizing it, and learning from it defines the rhythm of performance engineering.
        </p>
        <h2 className="text-3xl md:text-3xl font-semibold mb-6">Why It Matters</h2>
        <ul>
          <li>Latency drives perceived speed</li>
          <li>It reveals bottlenecks in distributed systems</li>
          <li>It helps predict scalability limits</li>
        </ul>
      </article>
    </SectionWrapper>
  );
}
