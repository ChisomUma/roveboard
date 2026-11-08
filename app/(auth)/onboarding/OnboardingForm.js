'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import BusinessFields, { emptyAnswers } from './BusinessFields';
import { createWorkspace } from './workspace';

// Step 2 for people who already have an account but no workspace yet
// (Google sign-ups, or an email sign-up that stopped part-way).
export default function OnboardingForm({ email }) {
  const [answers, setAnswers] = useState(emptyAnswers);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await createWorkspace(createClient(), answers);
    if (error) {
      console.error('Create workspace failed:', error);
      setError('We couldn’t create your workspace. Please try again.');
      setBusy(false);
      return;
    }
    window.location.href = '/dashboard';
  }

  async function logOut() {
    await createClient().auth.signOut();
    window.location.href = '/login?mode=signup';
  }

  return (
    <div className="au-card au-card-wide">
      <p className="au-step">Step 2 of 2</p>
      <h1>Tell us about your business</h1>
      <p className="au-sub">This sets up your private workspace and helps us build the right things for you. Your trips and suppliers are visible only to your company.</p>
      <form className="au-form" onSubmit={submit}>
        <BusinessFields answers={answers} setAnswers={setAnswers} />
        {error && <p className="au-error" role="alert">{error}</p>}
        <div className="au-actions">
          <button type="button" className="au-btn-secondary" onClick={logOut}>← Use a different account</button>
          <button className="au-btn" disabled={busy}>{busy ? 'Creating your workspace…' : 'Create workspace'}</button>
        </div>
      </form>
      <p className="au-switch">Signed in as {email}.</p>
    </div>
  );
}
