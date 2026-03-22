-- RAW Network — Supabase schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New query)

-- Content submissions table
create table if not exists submissions (
  id bigint generated always as identity primary key,
  pipeline_id text not null unique,
  input_type text not null check (input_type in ('text', 'voice_memo')),
  raw_content text not null,
  linkedin_content text,
  linkedin_char_count integer,
  linkedin_status text not null default 'pending' check (linkedin_status in ('pending', 'approved', 'rejected')),
  substack_content text,
  substack_word_count integer,
  substack_status text not null default 'pending' check (substack_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookups by pipeline_id
create index if not exists idx_submissions_pipeline_id on submissions (pipeline_id);

-- Index for listing recent submissions
create index if not exists idx_submissions_created_at on submissions (created_at desc);

-- Auto-update updated_at on row changes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger submissions_updated_at
  before update on submissions
  for each row
  execute function update_updated_at();

-- Row Level Security
alter table submissions enable row level security;

-- Allow the service role full access (used by API routes)
create policy "Service role full access"
  on submissions
  for all
  using (true)
  with check (true);

-- Allow anonymous reads for the dashboard (anon key)
create policy "Anon can read submissions"
  on submissions
  for select
  using (true);
