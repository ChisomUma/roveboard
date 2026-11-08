-- Roveboard: answers from sign-up step 2 ("Tell us about your business").
-- Run after the earlier 20261108 migrations. Answers are limited to the options the form offers.
-- Members can update their own organization (existing policy), so the form saves these right after
-- the workspace is created. View them in Supabase → Table Editor → organizations.

alter table public.organizations
  add column business_type text
    check (business_type in ('Tour operator', 'DMC', 'Travel agency', 'Wholesaler', 'Other')),
  add column trips_per_year text
    check (trips_per_year in ('1–10', '11–50', '51–200', '200+')),
  add column interests text[] not null default '{}'
    check (interests <@ array[
      'Supplier confirmations', 'Deposits and payment deadlines', 'Money owed per trip',
      'Contracts and documents', 'Spreadsheet import', 'Deadline reminders',
      'AI reading of emails and contracts', 'Team collaboration'
    ]::text[]),
  add column heard_from text
    check (heard_from in ('LinkedIn', 'Google search', 'Friend or colleague', 'Travel association or event', 'Social media', 'Other'));
