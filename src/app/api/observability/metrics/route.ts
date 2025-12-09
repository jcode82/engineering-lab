import { NextResponse } from "next/server";
import { generateObservabilitySeries } from "@/lib/server/observability";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const points = Number(searchParams.get("points") ?? "60");
  const withSpike = searchParams.get("withSpike") !== "false";

  const series = generateObservabilitySeries(points, { withSpike });
  return NextResponse.json(series);
}
