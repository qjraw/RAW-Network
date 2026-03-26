-- RAW Network — Supabase schema for content pipeline
-- Run this in: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS submissions (
  pipeline_id TEXT PRIMARY KEY,
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'voice_memo')),
  raw_content TEXT NOT NULL,

  -- LinkedIn
  linkedin_content TEXT,
  linkedin_char_count INTEGER,
  linkedin_status TEXT NOT NULL DEFAULT 'pending' CHECK (linkedin_status IN ('pending', 'approved', 'rejected')),

  -- Substack
  substack_content TEXT,
  substack_word_count INTEGER,
  substack_status TEXT NOT NULL DEFAULT 'pending' CHECK (substack_status IN ('pending', 'approved', 'rejected')),

  -- TikTok
  tiktok_content TEXT,
  tiktok_word_count INTEGER,
  tiktok_status TEXT NOT NULL DEFAULT 'pending' CHECK (tiktok_status IN ('pending', 'approved', 'rejected')),

  -- Instagram
  instagram_note TEXT,
  instagram_char_count INTEGER,
  instagram_status TEXT NOT NULL DEFAULT 'pending' CHECK (instagram_status IN ('pending', 'approved', 'rejected')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS but allow service role full access
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access"
  ON submissions
  FOR ALL
  USING (true)
  WITH CHECK (true);
