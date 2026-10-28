import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { ROLES, VOLUMES } from '../../waitlist-options';

// Stage 1: sign-ups are appended to data/waitlist.jsonl (one JSON object per line).
// This works on your computer or any server with a disk. Hosts like Vercel have no writable disk,
// so before going online this must move to real storage (e.g. a Supabase table); see the roadmap.
const FILE = path.join(process.cwd(), 'data', 'waitlist.jsonl');
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

  const entry = {
    email,
    role: ROLES.includes(body.role) ? body.role : '',
    tripsPerYear: VOLUMES.includes(body.tripsPerYear) ? body.tripsPerYear : '',
    consent: 'Email me about Roveboard early access (see Privacy Policy).',
    at: new Date().toISOString(),
  };

  try {
    await mkdir(path.dirname(FILE), { recursive: true });
    const existing = await readFile(FILE, 'utf8').catch(() => '');
    const already = existing.split('\n').some(line => line && JSON.parse(line).email === email);
    if (!already) await appendFile(FILE, JSON.stringify(entry) + '\n');
    return Response.json({ ok: true, already });
  } catch (err) {
    console.error('Waitlist save failed:', err);
    return Response.json({ error: 'Sorry, we couldn’t save that right now. Please try again later.' }, { status: 500 });
  }
}
