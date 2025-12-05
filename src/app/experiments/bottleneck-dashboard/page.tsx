import BottleneckPanel from "@/components/experiments/BottleneckPanel";
import SectionWrapper from "@/components/SectionWrapper";

export default function BottleneckDashboardPage() {
  return (
    <SectionWrapper id="bottleneck-dashboard" noBorder>
      <div className="max-w-3xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6">Bottleneck Dashboard</h1>
        <p className="opacity-80 leading-relaxed mb-8">
          Compare baseline queries, intentionally slow queries, and optimized
          queries. Each run executes 10 samples and renders an instant
          latency profile, giving you a visual feel for p95 performance.
        </p>
        <BottleneckPanel />
        <p className="mt-10 opacity-70 text-sm">
          Simulated latencies: Baseline 120–320ms · Slow 800–1500ms · Optimized
          40–90ms.
        </p>
      </div>
    </SectionWrapper>
  );
}
