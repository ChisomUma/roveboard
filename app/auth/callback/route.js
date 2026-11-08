import { NextResponse } from 'next/server';
import { createClient } from '../../lib/supabase/server';

// Google sign-in (and any emailed sign-in links) come back here with a one-time code,
// which we swap for a login session before sending the user on.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  let next = searchParams.get('next') || '/dashboard';
  if (!next.startsWith('/') || next.startsWith('//')) next = '/dashboard'; // only ever redirect within this site

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error('Auth callback failed:', error);
  }
  return NextResponse.redirect(`${origin}/login?error=signin`);
}
