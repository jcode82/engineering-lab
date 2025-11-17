import { NextResponse } from "next/server";
import { syncAllMetadata } from "@/lib/syncMetadata";

export async function GET(request: Request) {
    if (process.env.NODE_ENV === "production") {
    const key = request.headers.get("x-admin-key");
        if (key !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const result = await syncAllMetadata();
        return NextResponse.json({ success: true, ...result });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message,
        }, { status: 500 });
    }
}
