-- ============================================================
-- CONTENT TABLES FOR ENGINEERING LAB
-- Experiments + Notes (metadata only, served by MDX content)
-- ============================================================

create extension if not exists "uuid-ossp";

-- =======================
-- EXPERIMENTS
-- =======================
create table if not exists experiments (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  date date,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table experiments enable row level security;

create policy "public_read_experiments"
  on experiments for select
  to anon
  using (true);


-- =======================
-- NOTES
-- =======================
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  date date,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table notes enable row level security;

create policy "public_read_notes"
  on notes for select
  to anon
  using (true);


-- =======================================
-- TRIGGERS: KEEP updated_at AUTOMATICALLY
-- =======================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_experiments_timestamp
before update on experiments
for each row
execute procedure set_updated_at();

create trigger update_notes_timestamp
before update on notes
for each row
execute procedure set_updated_at();
