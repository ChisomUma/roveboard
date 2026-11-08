-- Roveboard: make test databases behave like the live project.
-- NO NEED TO RUN THIS ON THE LIVE PROJECT: it already works this way, because "automatically expose
-- new tables" was unticked when the project was created.
--
-- A local/test Supabase (`npx supabase start`, used by the automated tests) gives the app's roles
-- full access to every new table by default. Turning that off here means the tests catch a new table
-- that is missing its explicit `grant` lines, instead of that bug only showing up on the live site.
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from anon, authenticated, public;
