'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import BusinessFields, { emptyAnswers } from '../onboarding/BusinessFields';
import { createWorkspace } from '../onboarding/workspace';

function friendly(error) {
  const m = (error?.message || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password don’t match. Check them and try again.';
  if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox for the link.';
  if (m.includes('provider is not enabled')) return 'Google sign-in isn’t switched on yet. Use your email instead.';
  if (error?.status === 429 || m.includes('rate limit')) return 'Too many attempts. Please wait a minute and try again.';
  if (m.includes('password')) return error.message;
  return 'Something went wrong. Please try again.';
}

const alreadyRegistered = error => /already registered|already exists/i.test(error?.message || '');

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 7l7.1 5.5c4.2-3.9 7.2-9.6 7.2-17z" />
      <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.1-5.5c-2 1.4-4.6 2.2-8.8 2.2-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </svg>
  );
}

// Log in, or sign up in two steps. Signing up creates nothing until step 2 is submitted:
// step 1 only collects email and password, so "Previous" can always go back.
export default function LoginForm({ initialMode, googleEnabled, initialError }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [answers, setAnswers] = useState(emptyAnswers);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState('');
  const isSignup = mode === 'signup';

  function fail(message) {
    setError(message);
    setBusy(false);
  }

  async function logIn(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) return fail(friendly(error));
    window.location.href = '/dashboard'; // anyone without a workspace is sent on to step 2
  }

  function continueToStep2(e) {
    e.preventDefault();
    setError('');
    setStep(2);
  }

  async function createAccount(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const supabase = createClient();
    let { data, error } = await supabase.auth.signUp({
      email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    // An account with this email exists (e.g. a sign-up that stopped part-way): if the password
    // matches, sign in and finish setting up; otherwise send them back to step 1.
    if (alreadyRegistered(error)) {
      ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      if (error) {
        setStep(1);
        return fail('There’s already an account with this email, and that password doesn’t match. Log in instead, or use a different email.');
      }
    }
    if (error) {
      setStep(1);
      return fail(friendly(error));
    }
    if (!data.session) {
      setBusy(false);
      return setNotice('Almost there: check your email and click the link to confirm your account. You’ll finish setting up after that.');
    }
    const result = await createWorkspace(supabase, answers);
    if (result.error) {
      console.error('Create workspace failed:', result.error);
      return fail('Your account is ready, but we couldn’t create your workspace. Please try again.');
    }
    window.location.href = '/dashboard';
  }

  async function google() {
    setError('');
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) setError(friendly(error));
  }

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup');
    setStep(1);
    setError('');
    setNotice('');
  }

  if (isSignup && step === 2) {
    return (
      <div className="au-card au-card-wide">
        <p className="au-step">Step 2 of 2</p>
        <h1>Tell us about your business</h1>
        <p className="au-sub">This sets up your private workspace and helps us build the right things for you. Your trips and suppliers are visible only to your company.</p>
        <form className="au-form" onSubmit={createAccount}>
          <BusinessFields answers={answers} setAnswers={setAnswers} />
          {error && <p className="au-error" role="alert">{error}</p>}
          {notice && <p className="au-notice" role="status">{notice}</p>}
          <div className="au-actions">
            <button type="button" className="au-btn-secondary" onClick={() => { setStep(1); setError(''); }} disabled={busy}>← Previous</button>
            <button className="au-btn" disabled={busy}>{busy ? 'Creating your workspace…' : 'Create workspace'}</button>
          </div>
        </form>
        <p className="au-switch">Creating an account for {email}.</p>
      </div>
    );
  }

  return (
    <div className="au-card">
      {isSignup && <p className="au-step">Step 1 of 2</p>}
      <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
      <p className="au-sub">{isSignup ? 'Track your suppliers, deposits and deadlines in one place.' : 'Log in to your Roveboard workspace.'}</p>

      {googleEnabled && (
        <>
          <button type="button" className="au-google" onClick={google}><GoogleMark />Continue with Google</button>
          <p className="au-or">or with email</p>
        </>
      )}

      <form className="au-form" onSubmit={isSignup ? continueToStep2 : logIn}>
        <label>Email
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>Password
          <input type="password" required minLength={8} autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} />
          {isSignup && <small>At least 8 characters.</small>}
        </label>
        {error && <p className="au-error" role="alert">{error}</p>}
        {notice && <p className="au-notice" role="status">{notice}</p>}
        <button className="au-btn" disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Continue' : 'Log in'}</button>
      </form>

      <p className="au-switch">
        {isSignup ? 'Already have an account?' : 'New to Roveboard?'}{' '}
        <button type="button" onClick={switchMode}>{isSignup ? 'Log in' : 'Create an account'}</button>
      </p>
    </div>
  );
}
