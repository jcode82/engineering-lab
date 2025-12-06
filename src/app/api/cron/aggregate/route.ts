import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const { error } = await supabase.rpc("aggregate_daily_traffic");

  if (error) {
    console.error("[cron] aggregate error", error);
    return new Response("Error", { status: 500 });
  }

  return new Response("OK");
}
