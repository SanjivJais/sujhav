import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import decodeToken from './utils/decodeToken';
import { DecodedUser } from './types/user';


const publicRoutes = ['/auth']; // Routes accessible only when logged out
const privateRoutes = ['/u']

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value || null;

    let user: DecodedUser | null = null;
    if (token) {
        user = decodeToken(token);
    }

    const { pathname } = new URL(request.url);

    // Redirect to login if not authenticated
    if (!token && !user && privateRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Redirect to default homepage when authenticated and accessing public routes
    if ((token || user) && publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/u', request.url));
    }

    // Redirect to default home page if authenticated
    if ((token || user) && pathname === '/') {
        return NextResponse.redirect(new URL('/u', request.url));
    }

    // // Admin routes
    // if (token && user && pathname.startsWith('/admin') && user?.role !== 'Admin') {
    //     return NextResponse.redirect(new URL('/u', request.url));
    // }


    // Allow the request to proceed for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
        '/u/:path*',
    ], // Match paths to apply the middleware
};
