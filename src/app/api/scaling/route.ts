import { NextRequest, NextResponse } from "next/server";
import { simulateScaling, Scenario } from "@/lib/scalingSimulator";

export async function GET(req: NextRequest) {
  const scenario = (req.nextUrl.searchParams.get("scenario") || "thrashy") as Scenario;
  const points = simulateScaling(scenario);

  return NextResponse.json(
    { scenario, points },
    { headers: { "Cache-Control": "no-store" } }
  );
}
