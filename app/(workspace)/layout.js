import { redirect } from 'next/navigation';
import './workspace.css';
import { getWorkspaceSession } from '../lib/session';
import { billingEnforced } from '../lib/billing';
import { StoreProvider } from './store';
import { Shell } from './ui';

export const metadata = { title: 'Workspace · Roveboard' };

// The workspace is for signed-in users only. New users name their company first.
export default async function WorkspaceLayout({ children }) {
  const session = await getWorkspaceSession();
  if (session.mode !== 'live') redirect('/login');
  if (!session.org) redirect('/onboarding');
  // Trial over (or subscription cancelled): lock the workspace until they choose a plan. Off until payments work.
  if (billingEnforced() && !session.billing.hasAccess) redirect('/billing');
  return (
    <StoreProvider session={session}>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
