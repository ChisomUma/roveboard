-- ⏸ PAUSED (2026-11-08): don't run this until the founder resumes billing
--   (after the live domain, business registration and Paddle account are in place).

-- Roveboard: free trials and subscription status (billing phase 1).
-- Run after the earlier 20261108 migrations.
--
-- Billing lives in its own table that members can READ but never change: only the server (with the
-- secret key, after a verified message from the payment provider) may update it. This stops anyone
-- from marking their own company as "paid" through the API.

create table public.billing (
  org_id uuid primary key references public.organizations (id) on delete cascade,
  trial_ends_at timestamptz not null,
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'past_due', 'canceled', 'comp')), -- comp = free access given by the founder
  plan text check (plan in ('starter', 'growth', 'business', 'enterprise')),
  billing_interval text check (billing_interval in ('month', 'year')),
  provider_customer_id text,       -- set by the payment provider (Paddle) in phase 2
  provider_subscription_id text,
  current_period_ends_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.billing enable row level security;

create policy "Members can view their billing" on public.billing
  for select to authenticated using (public.is_member(org_id));

grant select on public.billing to authenticated; -- deliberately no insert/update/delete for users

-- New workspaces start a 20-day free trial (same function as before, plus the billing row).
create or replace function public.create_organization(org_name text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  new_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'You need to be signed in.';
  end if;
  if exists (select 1 from public.memberships where user_id = (select auth.uid())) then
    raise exception 'You already have a workspace.';
  end if;
  insert into public.organizations (name) values (trim(org_name)) returning id into new_id;
  insert into public.memberships (org_id, user_id, role) values (new_id, (select auth.uid()), 'owner');
  insert into public.billing (org_id, trial_ends_at) values (new_id, now() + interval '20 days');
  return new_id;
end;
$$;

-- Existing workspaces get a trial too. When billing goes live (phase 2), every trialing workspace
-- created before launch is reset to a fresh 20 days from the launch date (founder decision).
insert into public.billing (org_id, trial_ends_at)
select id, now() + interval '20 days' from public.organizations
on conflict (org_id) do nothing;
