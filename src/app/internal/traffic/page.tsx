import { createAdminClient } from "@/lib/supabase/admin";
import TrafficChart from "@/components/internal/TrafficChart";

export const dynamic = "force-dynamic";

const NEON_CARD =
  "relative overflow-hidden rounded-3xl border border-[var(--border)]/60 bg-[var(--surface)]/60 dark:bg-black/40 backdrop-blur-xl shadow-[0_0_60px_-25px_rgba(34,211,238,0.65)]";

function fmt(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function buildTimeline(events: Array<{ ts: string }>) {
  const map = new Map<string, number>();
  events.forEach((event) => {
    const iso = new Date(event.ts).toISOString().slice(0, 10);
    map.set(iso, (map.get(iso) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([iso, value]) => ({
      label: fmt(new Date(`${iso}T00:00:00`), { month: "short", day: "numeric" }),
      value,
    }));
}

export default async function TrafficDashboard() {
  const supabase = createAdminClient();
  const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

  const { data: events } = await supabase
    .from("traffic_events")
    .select("path,user_hash,ts")
    .gte("ts", thirtyDaysAgo.toISOString())
    .order("ts", { ascending: true })
    .limit(2000);

  const { data: daily } = await supabase
    .from("traffic_daily")
    .select("date,total_visits,unique_visitors")
    .order("date", { ascending: true })
    .limit(30);

  const safeEvents = events ?? [];
  const timeline = daily?.length
    ? daily.map((day) => ({
        label: fmt(new Date(day.date), { month: "short", day: "numeric" }),
        value: day.total_visits,
      }))
    : buildTimeline(safeEvents);

  const totalVisits = safeEvents.length;
  const uniqueVisitors = new Set(safeEvents.map((e) => e.user_hash)).size;

  const topPages = safeEvents.reduce<Record<string, number>>((acc, event) => {
    acc[event.path] = (acc[event.path] ?? 0) + 1;
    return acc;
  }, {});

  const sortedPages = Object.entries(topPages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <header className="space-y-3 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary-300">
          Internal Dashboard
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">Traffic Insights</h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Privacy-safe analytics collected with hashed IPs. Use this page to
          understand which experiments attract attention without storing any
          personal data.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${NEON_CARD} p-8`}>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <p className="text-sm uppercase tracking-[0.3em] text-primary-200">
            Total Visits (30d)
          </p>
          <p className="mt-4 text-5xl font-black text-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.55)]">
            {totalVisits}
          </p>
        </div>
        <div className={`${NEON_CARD} p-8`}>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
          <p className="text-sm uppercase tracking-[0.3em] text-purple-200">
            Unique Visitors (30d)
          </p>
          <p className="mt-4 text-5xl font-black text-purple-200 drop-shadow-[0_0_25px_rgba(168,85,247,0.55)]">
            {uniqueVisitors}
          </p>
        </div>
      </section>

      <section className={`${NEON_CARD} p-8`}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300">
              Timeline
            </p>
            <h2 className="text-2xl font-semibold">Visits over time</h2>
          </div>
          <TrafficChart data={timeline} />
        </div>
      </section>

      <section className={`${NEON_CARD} p-6`}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Top Pages</h2>
          <p className="text-sm opacity-70">Last 30 days</p>
        </div>
        <div className="space-y-3">
          {sortedPages.length === 0 && (
            <p className="text-sm opacity-70">No traffic events yet.</p>
          )}
          {sortedPages.map(([path, hits]) => (
            <div
              key={path}
              className="flex items-center justify-between rounded-2xl border border-[var(--border)]/60 bg-black/10 px-4 py-3"
            >
              <span className="font-medium text-sm">{path}</span>
              <span className="text-primary-200 font-semibold">{hits}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
