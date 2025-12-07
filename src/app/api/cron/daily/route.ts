import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const { error: aggErr } = await supabase.rpc("aggregate_daily_traffic");
  const { error: purgeErr } = await supabase.rpc("traffic_purge_old");

  if (aggErr || purgeErr) {
    console.error("daily cron errors", { aggErr, purgeErr });
  }

  return new Response(
    JSON.stringify({
      ok: !aggErr && !purgeErr,
      aggregate_error: aggErr ?? null,
      purge_error: purgeErr ?? null,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
