// Roveboard pricing: edit prices, limits and wording here. These are starting prices to test with
// customers. Yearly billing is "2 months free" (12 months for the price of 10).
// Billing isn't live yet (Stripe arrives with the first paying customer), so the page promises
// no automatic charges. Trip limits aren't enforced in the app yet either.
export const CURRENCY = '£';
export const TRIAL_DAYS = 20;

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small operators getting organised',
    trips: 'Up to 10 trips a year',
    monthly: 35,
    yearly: 350,
    features: ['Unlimited suppliers', 'Deposit, balance and deadline tracking', 'Money owed per trip', 'Spreadsheet import', 'Supplier directory and reuse', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For busy tour operators and DMCs',
    trips: 'Up to 50 trips a year',
    monthly: 84,
    yearly: 840,
    popular: true,
    features: ['Everything in Starter', 'Priority email support', 'Help importing your existing trips'],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For established teams',
    trips: 'Up to 200 trips a year',
    monthly: 179,
    yearly: 1790,
    features: ['Everything in Growth', 'Onboarding call for your team', 'Early access to new features'],
  },
];

// Included in every plan today, and on the way.
export const INCLUDED = ['Unlimited suppliers on every trip', 'Confirmation status for every supplier', 'Deposits, final balances and due dates', 'Money summary showing what’s paid, owed and overdue', 'Deadlines across all your trips', 'Spreadsheet import (CSV, or paste from Excel or Google Sheets)', 'Supplier directory and one-click reuse', 'Export everything to a spreadsheet, any time', 'Private, secure workspace for your company'];
export const COMING_SOON = ['Email reminders before deadlines', 'AI reading of supplier emails and contracts', 'Contract and document uploads', 'Team members and collaboration'];
