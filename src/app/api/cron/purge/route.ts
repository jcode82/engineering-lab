import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  const { error } = await supabase.rpc("traffic_purge_old");

  if (error) {
    console.error("[cron] purge error", error);
    return new Response("Error", { status: 500 });
  }

  return new Response("OK");
}
