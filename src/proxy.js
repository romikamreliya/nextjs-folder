import { NextResponse } from 'next/server'
import { cookiesAuthKey } from './lib/enum'

// Auth routes
const AuthRoutes = [
    '/dashboard'
]

// Without Auth routes
const WithoutAuthRoutes = ['/login']

export function proxy(request) {
    
    const { pathname } = request.nextUrl
    
    // Allow public routes
    if (WithoutAuthRoutes.includes(pathname)) {
        return NextResponse.next()
    }

    const cookieValue = request.cookies.get(cookiesAuthKey)?.value;

    // No cookie
    if (!cookieValue) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const userData = JSON.parse(cookieValue);
        const isValid =
            userData && typeof userData === 'object' &&
            typeof userData.token === 'string' && userData.token.trim() !== '' &&
            typeof userData.refreshToken === 'string' && userData.refreshToken.trim() !== '' &&
            userData.user &&
            typeof userData.user === 'object' &&
            typeof userData.user.id === 'string' &&
            typeof userData.user.email === 'string';

        // Invalid structure
        if (!isValid) {
            const response = NextResponse.redirect(
                new URL('/login', request.url)
            )
            response.cookies.delete(cookiesAuthKey)
            return response
        }

        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(
            new URL('/login', request.url)
        )
        response.cookies.delete(cookiesAuthKey)
        return response
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
}