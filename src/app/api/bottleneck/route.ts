import { NextResponse } from "next/server";

function randomInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const scenario = url.searchParams.get("scenario") ?? "baseline";

  let delay = 0;

  switch (scenario) {
    case "baseline":
      delay = randomInRange(120, 320);
      break;
    case "slow":
      delay = randomInRange(800, 1500);
      break;
    case "optimized":
      delay = randomInRange(40, 90);
      break;
    default:
      delay = randomInRange(120, 320);
  }

  await new Promise((resolve) => setTimeout(resolve, delay));

  return NextResponse.json({
    scenario,
    latency: delay,
    timestamp: Date.now(),
  });
}
