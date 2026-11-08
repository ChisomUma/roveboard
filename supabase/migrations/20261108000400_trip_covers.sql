-- Roveboard: optional cover photo for each trip, shown on the trip cards.
-- Run after the earlier 20261108 migrations. Like supplier photos, covers are resized in the browser
-- (roughly 40–60 KB) and stored inline for now; they move to Supabase Storage together with contracts later.
alter table public.trips
  add column cover text check (cover is null or char_length(cover) < 400000);
