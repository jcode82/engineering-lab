import { NextResponse } from "next/server";
import {
  generateObservabilityAlerts,
  generateObservabilitySeries,
} from "@/lib/server/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  const series = generateObservabilitySeries(60, { withSpike: true });
  const alerts = generateObservabilityAlerts(series);
  return NextResponse.json({ alerts });
}
