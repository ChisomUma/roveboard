-- Roveboard: mark sample trips (run after 20261108_initial_schema.sql).
-- New workspaces start with sample trips so the dashboard isn't empty. Marking them lets the app label
-- them clearly and remove them in one click, so they never mix with a company's real money and deadlines.
alter table public.trips add column is_sample boolean not null default false;
