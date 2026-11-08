import { createClient } from './supabase/server';
import { billingSummary } from './billing';

const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

// Who is looking at the workspace?
//   { mode: 'guest' }                                 logged out
//   { mode: 'live', user, org }                       logged in; org is null until they name their company
// This decides what to show. It is not the security boundary: the database's Row Level
// Security rules decide what data each user can actually read or change.
export async function getWorkspaceSession() {
  if (!configured()) return { mode: 'guest' };
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { mode: 'guest' };

  const { data: membership } = await supabase
    .from('memberships')
    .select('role, organizations (id, name, notes)')
    .eq('user_id', claims.sub)
    .maybeSingle();

  const org = membership?.organizations || null;
  // Trial / subscription status. Read separately so a missing billing table never breaks login.
  let billing = billingSummary(null);
  if (org) {
    const { data: row } = await supabase.from('billing').select('trial_ends_at, status, plan').eq('org_id', org.id).maybeSingle();
    billing = billingSummary(row);
  }

  return {
    mode: 'live',
    user: { id: claims.sub, email: claims.email || '' },
    org,
    billing,
  };
}

// Which sign-in methods are switched on in Supabase (e.g. Google), so the login page only offers what works.
export async function getAuthSettings() {
  if (!configured()) return { configured: false, google: false };
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
      cache: 'no-store',
    });
    const settings = await res.json();
    return { configured: true, google: Boolean(settings.external?.google) };
  } catch {
    return { configured: true, google: false };
  }
}
