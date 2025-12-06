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

-- =======================
-- CASE STUDIES
-- =======================
create table if not exists case_studies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  excerpt text,
  date date,
  tags text[] default '{}',
  status text check (status in ('Resolved','Ongoing')) default 'Resolved',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table case_studies enable row level security;

create policy "public_read_case_studies"
  on case_studies for select
  to anon
  using (true);

create or replace function set_case_studies_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_case_studies_timestamp
before update on case_studies
for each row
execute procedure set_case_studies_updated_at();

-- =======================
-- TRAFFIC ANALYTICS
-- =======================
create table if not exists traffic_events (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  user_hash text not null,
  user_agent text,
  ts timestamptz not null default now()
);

create index if not exists traffic_events_ts_idx on traffic_events (ts desc);
create index if not exists traffic_events_path_idx on traffic_events (path);

create table if not exists traffic_daily (
  date date primary key,
  total_visits integer not null,
  unique_visitors integer not null,
  top_pages jsonb not null default '[]'::jsonb
);

alter table traffic_events enable row level security;
alter table traffic_daily enable row level security;

create policy "traffic_insert_public"
  on traffic_events for insert
  to anon
  with check (true);

create policy "traffic_select_admin"
  on traffic_events for select
  to service_role
  using (true);

create policy "traffic_daily_select_admin"
  on traffic_daily for select
  to service_role
  using (true);

create or replace function aggregate_daily_traffic()
returns void
language plpgsql
as $$
declare
  target_date date := (now() - interval '1 day')::date;
begin
  insert into traffic_daily (date, total_visits, unique_visitors, top_pages)
  values (
    target_date,
    (
      select count(*) from traffic_events where ts::date = target_date
    ),
    (
      select count(distinct user_hash) from traffic_events where ts::date = target_date
    ),
    (
      select coalesce(
        json_agg(row_to_json(t)),
        '[]'::jsonb
      )
      from (
        select path, count(*) as hits
        from traffic_events
        where ts::date = target_date
        group by path
        order by hits desc
        limit 10
      ) t
    )
  )
  on conflict (date) do update
  set
    total_visits = excluded.total_visits,
    unique_visitors = excluded.unique_visitors,
    top_pages = excluded.top_pages;
end;
$$;
