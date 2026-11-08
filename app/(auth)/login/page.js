import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { getAuthSettings, getWorkspaceSession } from '../../lib/session';

export const metadata = { title: 'Log in · Roveboard' };

// Fixed messages for errors passed back in the URL (we never display text taken from the URL).
const ERRORS = { signin: 'Sign-in didn’t complete. Please try again.' };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const session = await getWorkspaceSession();
  if (session.mode === 'live') redirect(session.org ? '/dashboard' : '/onboarding');

  const settings = await getAuthSettings();
  if (!settings.configured) {
    return (
      <div className="au-card">
        <h1>Accounts aren’t switched on yet</h1>
        <p className="au-sub">Please check back soon.</p>
      </div>
    );
  }
  return (
    <LoginForm
      initialMode={params.mode === 'signup' ? 'signup' : 'login'}
      googleEnabled={settings.google}
      initialError={Object.hasOwn(ERRORS, params.error ?? '') ? ERRORS[params.error] : ''}
    />
  );
}
