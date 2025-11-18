import { NextResponse } from "next/server";
import { syncAllMetadata } from "@/lib/syncMetadata";

interface SyncResult {
  experimentsSynced: number;
  notesSynced: number;
}

export async function GET(request: Request) {
  // ----- Production protection -----
  if (process.env.NODE_ENV === "production") {
    const key = request.headers.get("x-admin-key");

    if (!key || key !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  try {
    const result: SyncResult = await syncAllMetadata();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    const err = error as { message?: string };

    return NextResponse.json(
      {
        success: false,
        error: err.message ?? "Unknown sync error",
      },
      { status: 500 }
    );
  }
}
