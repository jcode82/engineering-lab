import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function TrafficMonitoring() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("traffic_guard_events")
    .select("reason")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (!data || data.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-4">Traffic Guard Monitoring</h1>
        <p className="opacity-70">No guard events recorded yet 🎉</p>
      </div>
    );
  }

  const total = data.length;
  const counts = data.reduce<Record<string, number>>((acc, row) => {
    acc[row.reason] = (acc[row.reason] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
      <section
        className="rounded-3xl border border-[var(--border)]/70 bg-[var(--surface)]/50 backdrop-blur-2xl p-8 shadow-[0_0_60px_-20px_rgba(14,165,233,0.45)]"
      >
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">
          Guard Overview
        </p>
        <div className="flex items-baseline gap-4 mt-4">
          <span className="text-5xl font-black text-cyan-200">{total}</span>
          <span className="opacity-70 text-sm">blocked / ignored events</span>
        </div>
      </section>

      <section
        className="rounded-3xl border border-[var(--border)]/70 bg-[var(--surface)]/40 backdrop-blur-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">By reason</h2>
        <div className="space-y-3">
          {Object.entries(counts).map(([reason, value]) => (
            <div
              key={reason}
              className="flex items-center justify-between rounded-2xl bg-black/20 border border-white/5 px-4 py-3"
            >
              <span className="capitalize text-sm">{reason}</span>
              <span className="font-mono text-cyan-200">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
