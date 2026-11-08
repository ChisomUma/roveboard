-- Roveboard: initial database schema (stage 2).
-- Run once in Supabase → SQL Editor → New query → paste this whole file → Run.
--
-- Security model: every row belongs to an organization (a travel company). Row Level Security
-- lets signed-in users reach only rows of organizations they are a member of. New tables are not
-- exposed automatically (that option was unticked), so access is granted explicitly below.

-- ---------- tables ----------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.memberships (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 200),
  start_date date,
  end_date date,
  travellers integer check (travellers > 0),
  currency text not null default 'EUR' check (currency in ('EUR', 'GBP', 'USD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_date is null or end_date is null or end_date >= start_date),
  unique (id, org_id)
);

-- A supplier booked on a trip (the "booking": confirmation, payments and notes are per trip).
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  trip_id uuid not null,
  name text not null check (char_length(trim(name)) between 1 and 200),
  category text not null default 'Other' check (category in ('Hotel', 'Transport', 'Guide', 'Restaurant', 'Activity', 'Other')),
  place text,
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Cancelled')),
  contact text,
  notes text,
  photo text check (photo is null or char_length(photo) < 200000), -- small thumbnail (data URL); moves to Storage later
  deposit_amount numeric(12, 2) check (deposit_amount >= 0),
  deposit_due date,
  deposit_paid boolean not null default false,
  balance_amount numeric(12, 2) check (balance_amount >= 0),
  balance_due date,
  balance_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- the trip must belong to the same organization as the supplier row
  foreign key (trip_id, org_id) references public.trips (id, org_id) on delete cascade
);

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and char_length(email) <= 254),
  role text check (role is null or char_length(role) <= 40),
  trips_per_year text check (trips_per_year is null or char_length(trips_per_year) <= 20),
  consent text not null check (char_length(consent) <= 200),
  created_at timestamptz not null default now()
);

create index trips_org_id_idx on public.trips (org_id);
create index suppliers_org_id_idx on public.suppliers (org_id);
create index suppliers_trip_id_idx on public.suppliers (trip_id);
create index memberships_user_id_idx on public.memberships (user_id);

-- ---------- helpers ----------

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_updated_at before update on public.trips
  for each row execute function public.set_updated_at();
create trigger suppliers_updated_at before update on public.suppliers
  for each row execute function public.set_updated_at();

-- Is the signed-in user a member of this organization? Used by every security rule below.
create function public.is_member(org uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships m
    where m.org_id = org and m.user_id = (select auth.uid())
  );
$$;

-- Creates a workspace for the signed-in user and makes them its owner (one workspace per user for now).
create function public.create_organization(org_name text) returns uuid
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
  return new_id;
end;
$$;

revoke execute on function public.is_member(uuid) from public, anon;
revoke execute on function public.create_organization(text) from public, anon;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.create_organization(text) to authenticated;

-- ---------- row level security ----------

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.trips enable row level security;
alter table public.suppliers enable row level security;
alter table public.waitlist enable row level security;

create policy "Members can view their organization" on public.organizations
  for select to authenticated using (public.is_member(id));
create policy "Members can update their organization" on public.organizations
  for update to authenticated using (public.is_member(id)) with check (public.is_member(id));

create policy "Members can view their organization's members" on public.memberships
  for select to authenticated using (public.is_member(org_id));

create policy "Members can view trips" on public.trips
  for select to authenticated using (public.is_member(org_id));
create policy "Members can add trips" on public.trips
  for insert to authenticated with check (public.is_member(org_id));
create policy "Members can update trips" on public.trips
  for update to authenticated using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy "Members can delete trips" on public.trips
  for delete to authenticated using (public.is_member(org_id));

create policy "Members can view suppliers" on public.suppliers
  for select to authenticated using (public.is_member(org_id));
create policy "Members can add suppliers" on public.suppliers
  for insert to authenticated with check (public.is_member(org_id));
create policy "Members can update suppliers" on public.suppliers
  for update to authenticated using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy "Members can delete suppliers" on public.suppliers
  for delete to authenticated using (public.is_member(org_id));

-- Anyone can join the waitlist; nobody can read it through the API (view it in the Supabase dashboard).
create policy "Anyone can join the waitlist" on public.waitlist
  for insert to anon, authenticated with check (true);

-- ---------- table access (only what the app needs) ----------

grant usage on schema public to anon, authenticated;
grant select, update on public.organizations to authenticated;
grant select on public.memberships to authenticated;
grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.suppliers to authenticated;
grant insert on public.waitlist to anon, authenticated;
