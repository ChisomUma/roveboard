// Sign-up step 2 options. Keep these in sync with the checks in
// supabase/migrations/20261108_signup_questions.sql (the database rejects anything else).
export { ROLES as BUSINESS_TYPES, VOLUMES as TRIP_VOLUMES } from '../../waitlist-options';

// [value, soon?]: "coming soon" features are labelled honestly; interest in them tells us what to build next.
export const INTERESTS = [
  ['Supplier confirmations', false],
  ['Deposits and payment deadlines', false],
  ['Money owed per trip', false],
  ['Contracts and documents', false],
  ['Spreadsheet import', false],
  ['Deadline reminders', true],
  ['AI reading of emails and contracts', true],
  ['Team collaboration', true],
];

export const SOURCES = ['LinkedIn', 'Google search', 'Friend or colleague', 'Travel association or event', 'Social media', 'Other'];
