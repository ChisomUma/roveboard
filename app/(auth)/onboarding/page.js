import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';
import { getWorkspaceSession } from '../../lib/session';

export const metadata = { title: 'Tell us about your business · Roveboard' };

export default async function OnboardingPage() {
  const session = await getWorkspaceSession();
  if (session.mode !== 'live') redirect('/login');
  if (session.org) redirect('/dashboard');
  return <OnboardingForm email={session.user.email} />;
}
