// Trial and subscription rules, shared by the workspace layout (the lock) and the trial banner.
//
// The lock stays OFF until online payment works (phase 2), so nobody is shut out with no way to pay.
// Switch it on by setting BILLING_ENFORCED=true in Vercel's environment variables.
export const billingEnforced = () => process.env.BILLING_ENFORCED === 'true';

const DAY = 24 * 60 * 60 * 1000;

// Summarise a billing row for display: { status, daysLeft, trialOver, hasAccess }.
export function billingSummary(billing, now = Date.now()) {
  if (!billing) return { status: 'none', daysLeft: null, trialOver: false, hasAccess: true }; // no row yet: never lock
  const daysLeft = Math.ceil((new Date(billing.trial_ends_at).getTime() - now) / DAY);
  // past_due keeps access while the payment provider retries the card (a grace period); canceled doesn't.
  const paidUp = ['active', 'comp', 'past_due'].includes(billing.status);
  const trialOver = billing.status === 'trialing' && daysLeft <= 0;
  return {
    status: billing.status,
    plan: billing.plan || null,
    daysLeft,
    trialOver,
    hasAccess: paidUp || (billing.status === 'trialing' && daysLeft > 0),
  };
}
