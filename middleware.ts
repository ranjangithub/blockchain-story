import { NextRequest, NextResponse } from "next/server";

const FREE_SCENES = 17;
const UNLOCK_COOKIE = "course_access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/scene\/(\d+)$/);
  if (!match) return NextResponse.next();

  const sceneId = parseInt(match[1], 10);
  if (sceneId <= FREE_SCENES) return NextResponse.next();

  const token = request.cookies.get(UNLOCK_COOKIE)?.value;
  if (token && token === process.env.UNLOCK_TOKEN) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/upgrade";
  url.searchParams.set("from", String(sceneId));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/scene/:path*",
};
