import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutesPrefix = "/home";
const apiAuthPrefix = '/api';

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isNextAsset = nextUrl.pathname.startsWith("/_next");
    const isStaticFile = /\.(?:css|js|map|png|jpg|jpeg|svg|gif|ico|webp|woff2|ttf)$/.test(nextUrl.pathname);
    const isFavicon = nextUrl.pathname === "/favicon.ico";

    if (isNextAsset || isStaticFile || isFavicon) {
      return NextResponse.next();
		} else if(nextUrl.pathname.startsWith(apiAuthPrefix)) {
      return NextResponse.next();
    } else if(isLoggedIn && nextUrl.pathname === "/login") {
      return NextResponse.redirect(`${nextUrl.origin}/home`);
    } else if(!isLoggedIn && nextUrl.pathname.startsWith(protectedRoutesPrefix)) {
      return NextResponse.redirect(`${nextUrl.origin}/login`);
    }

    return NextResponse.next();
});
