'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './components/icons';

export default function WaitlistForm() {
  const [form, setForm] = useState({ email: '', website: '' });
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="lp-wl-done" role="status">
        <Icon name="checkFilled" size={26} />
        <div><b>You’re subscribed.</b><span>Thanks! We’ll email you when there’s news.</span></div>
      </div>
    );
  }

  return (
    <form className="lp-wl" onSubmit={submit}>
      <div className="lp-wl-row">
        <label className="lp-sr" htmlFor="wl-email">Work email</label>
        <input id="wl-email" type="email" required autoComplete="email" placeholder="Your work email" value={form.email} onChange={set('email')} />
        <button className="lp-btn lp-btn-ghost" disabled={state === 'sending'}>{state === 'sending' ? 'Subscribing…' : 'Get updates'}</button>
      </div>
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <input className="lp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={set('website')} name="website" />
      {error && <p className="lp-wl-error" role="alert">{error}</p>}
      <p className="lp-wl-note">Only Roveboard product news. Unsubscribe any time. See our <Link href="/privacy">Privacy Policy</Link>.</p>
    </form>
  );
}
