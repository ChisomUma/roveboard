import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Runs before the routes below render and keeps the Supabase login session fresh
// (Next.js 16 renamed middleware.js to proxy.js). It never blocks anyone: logged-out
// visitors simply see the demo. Data access is protected by Row Level Security in the database.
export async function proxy(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Responses that set auth cookies must never be cached (another user could receive them).
        Object.entries(headers || {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // Verifies the session and refreshes it if it's about to expire.
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*', '/trips/:path*', '/suppliers/:path*', '/deadlines/:path*', '/documents/:path*', '/notes/:path*',
    '/login', '/onboarding', '/auth/:path*',
  ],
};
