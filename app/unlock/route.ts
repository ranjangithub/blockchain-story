import { NextRequest, NextResponse } from "next/server";

const UNLOCK_COOKIE = "course_access";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const expected = process.env.UNLOCK_TOKEN;

  if (!expected || !token || token !== expected) {
    const url = request.nextUrl.clone();
    url.pathname = "/upgrade";
    url.searchParams.set("error", "invalid");
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(new URL("/scene/18", request.url));
  response.cookies.set(UNLOCK_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: ONE_YEAR,
    path: "/",
  });
  return response;
}
