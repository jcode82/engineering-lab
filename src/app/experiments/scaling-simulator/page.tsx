import ArticleLayout from "@/components/ArticleLayout";
import ScalingCharts from "@/components/experiments/ScalingCharts";

export const metadata = {
  title: "Scaling Simulator – Engineering Lab",
  description:
    "Visualize how naive autoscaling thrashes compared to a stabilized policy with smoothing and cooldown logic.",
};

export default function ScalingSimulatorPage() {
  return (
    <ArticleLayout
      title="Scaling Simulator"
      date="2025-12-07"
      tags={["scaling", "autoscaling", "reliability", "observability"]}
      kind="experiment"
    >
      <div className="space-y-10">
        <section className="space-y-4 text-sm opacity-80">
          <p>
            This experiment simulates a simple autoscaler responding to a spiky
            10-minute load pattern. Compare two policies:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Thrashy</strong> – scales replicas to the instantaneous
              desired count with no smoothing or cooldown.
            </li>
            <li>
              <strong>Stable</strong> – uses a smoothed utilization signal and a
              cooldown window before adjusting replica counts.
            </li>
          </ul>
          <p>
            Use the toggle below to see how replica thrashing affects CPU,
            memory, and overall capacity tracking.
          </p>
        </section>

        <section>
          <ScalingCharts />
        </section>

        <section className="space-y-4 text-sm opacity-80">
          <h2 className="text-base font-semibold">What to watch</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>How often replica count changes under each policy.</li>
            <li>CPU and memory volatility.</li>
            <li>Whether capacity closely tracks load.</li>
          </ul>
          <p>
            Autoscaling is a control system. Thrashy policies look responsive
            but oscillate badly. A few guardrails turn chaos into something the
            on-call engineer can actually predict.
          </p>
        </section>
      </div>
    </ArticleLayout>
  );
}
