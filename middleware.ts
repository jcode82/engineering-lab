import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const matcherPrefix = "/internal";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(matcherPrefix)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Engineering Lab Internal"' },
    });
  }

  const base64 = authHeader.replace("Basic ", "");
  const [user, pass] = Buffer.from(base64, "base64").toString("utf8").split(":");

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
