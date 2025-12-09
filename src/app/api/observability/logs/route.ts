import { NextResponse } from "next/server";
import {
  generateObservabilityLogs,
  generateObservabilitySeries,
} from "@/lib/server/observability";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const count = Number(searchParams.get("count") ?? "40");

  const series = generateObservabilitySeries(40, { withSpike: true });
  const logs = generateObservabilityLogs(count, series);

  return NextResponse.json({ logs });
}
