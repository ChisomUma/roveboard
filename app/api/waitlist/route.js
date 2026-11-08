import { createClient } from '@supabase/supabase-js';
import { ROLES, VOLUMES } from '../../waitlist-options';

// "Get product updates" sign-ups are saved to the Supabase `waitlist` table (works on Vercel). The table's security rules
// let anyone add a row but nobody read the list through the API: view it in the Supabase dashboard.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 400 });
  }

  // Honeypot: real people never see or fill this field, bots usually do.
  if (body.website) return Response.json({ ok: true });

  const email = String(body.email || '').trim().toLowerCase().slice(0, 254);
  if (!EMAIL.test(email)) return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error('Waitlist: Supabase environment variables are missing.');
    return Response.json({ error: 'Sorry, we couldn’t save that right now. Please try again later.' }, { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from('waitlist').insert({
    email,
    role: ROLES.includes(body.role) ? body.role : null,
    trips_per_year: VOLUMES.includes(body.tripsPerYear) ? body.tripsPerYear : null,
    consent: 'Email me Roveboard product updates (see Privacy Policy).',
  });

  if (error?.code === '23505') return Response.json({ ok: true, already: true }); // already on the list
  if (error) {
    console.error('Waitlist save failed:', error);
    return Response.json({ error: 'Sorry, we couldn’t save that right now. Please try again later.' }, { status: 500 });
  }
  return Response.json({ ok: true, already: false });
}
