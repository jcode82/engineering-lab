import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const BOT_KEYWORDS = [
  "bot",
  "crawler",
  "spider",
  "curl",
  "python-requests",
  "axios",
  "wget",
  "scraper",
  "bingpreview",
  "facebookexternalhit",
  "yandex",
  "uptime",
  "monitor",
];

async function logGuard(reason: string) {
  try {
    const supabase = createAdminClient();
    await supabase.from("traffic_guard_events").insert({ reason });
  } catch (error) {
    console.error("[track] guard log error", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const host = req.headers.get("host") || "";
    const uaHeader = req.headers.get("user-agent") ?? "";
    const ua = uaHeader.toLowerCase();

    const supabase = createAdminClient();

    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      await logGuard("localhost");
      return NextResponse.json({ ok: true, ignored: "localhost" });
    }

    if (ua.length < 10) {
      await logGuard("suspicious-UA");
      return NextResponse.json({ ok: true, ignored: "suspicious-UA" });
    }

    if (BOT_KEYWORDS.some((keyword) => ua.includes(keyword))) {
      await logGuard("bot");
      return NextResponse.json({ ok: true, ignored: "bot" });
    }

    let payload: { path?: string } | null = null;
    try {
      payload = await req.json();
    } catch {
      payload = null;
    }

    const path = payload?.path;
    if (!path || typeof path !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
    }

    const ip =
      req.ip ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const userHash = crypto.createHash("sha256").update(ip).digest("hex");

    const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();
    const { data: recent } = await supabase
      .from("traffic_events")
      .select("id")
      .eq("user_hash", userHash)
      .gt("ts", tenSecondsAgo)
      .limit(1);

    if (recent?.length) {
      await logGuard("throttled");
      return NextResponse.json({ ok: true, throttled: true });
    }

    const { error } = await supabase.from("traffic_events").insert({
      path,
      user_hash: userHash,
      user_agent: uaHeader.slice(0, 256),
    });

    if (error) {
      console.error("[track] insert error", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[track] error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
