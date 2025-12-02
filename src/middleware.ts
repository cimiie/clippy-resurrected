import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();

    // CORS headers - only allow same origin in production
    if (process.env.NODE_ENV === 'production') {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      
      // Only set CORS headers if origin matches host
      if (origin && host && origin.includes(host)) {
        response.headers.set('Access-Control-Allow-Origin', origin);
      }
    } else {
      // Development - allow localhost
      response.headers.set('Access-Control-Allow-Origin', '*');
    }

    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
