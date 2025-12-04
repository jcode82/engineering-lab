import { NextResponse } from "next/server";

export async function GET() {
  const roll = Math.random();

  if (roll < 0.4) {
    return NextResponse.json({ message: "OK", roll }, { status: 200 });
  }

  if (roll < 0.7) {
    return NextResponse.json(
      { message: "Internal Error", roll },
      { status: 500 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return NextResponse.json({ message: "Timeout", roll }, { status: 408 });
}
