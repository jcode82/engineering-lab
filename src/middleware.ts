import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

console.log("🔴 MIDDLEWARE FILE LOADED");

export function middleware(req: NextRequest) {
  console.log("🟡 MIDDLEWARE EXECUTED for:", req.nextUrl.pathname);
  console.log("[middleware fired] path =", req.nextUrl.pathname);
  if (process.env.NODE_ENV === "development") {
    console.log("[middleware] request", req.nextUrl.pathname);
  }

  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Engineering Lab Internal"' },
    });
  }

  const base64 = authHeader.replace("Basic ", "");
  let decoded = "";
  try {
    decoded = atob(base64);
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [user, pass] = decoded.split(":");

  const expectedUser = process.env.INTERNAL_USER || "lab";
  const expectedPass = process.env.INTERNAL_PASS || "secret";

  if (user !== expectedUser || pass !== expectedPass) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/internal/:path*"],
};
