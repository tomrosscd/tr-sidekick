-- ═══════════════════════════════════════════════════════════════════
-- Sidekick Prompt Library — Supabase Schema
-- ═══════════════════════════════════════════════════════════════════

-- ── Enums ──────────────────────────────────────────────────────────

CREATE TYPE visibility AS ENUM ('public', 'internal', 'draft');
CREATE TYPE prompt_status AS ENUM ('published', 'archived', 'draft');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE event_type AS ENUM (
  'prompt_view',
  'prompt_copy',
  'prompt_share',
  'prompt_submit',
  'search_used',
  'filter_used'
);

-- ── Prompts ────────────────────────────────────────────────────────

CREATE TABLE prompts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT NOT NULL UNIQUE,
  title                 TEXT NOT NULL,
  short_description     TEXT,
  prompt_body           TEXT NOT NULL,
  category              TEXT NOT NULL,
  use_cases             TEXT[] DEFAULT '{}',
  data_sources          TEXT[] DEFAULT '{}',
  output_types          TEXT[] DEFAULT '{}',
  business_objectives   TEXT[] DEFAULT '{}',
  funnel_stages         TEXT[] DEFAULT '{}',
  level                 experience_level DEFAULT 'intermediate',
  visibility            visibility NOT NULL DEFAULT 'internal',
  status                prompt_status NOT NULL DEFAULT 'draft',
  when_to_use           TEXT,
  caveats               TEXT,
  follow_up_prompt_ids  UUID[] DEFAULT '{}',
  is_featured           BOOLEAN NOT NULL DEFAULT FALSE,
  is_recommended        BOOLEAN NOT NULL DEFAULT FALSE,
  source_label          TEXT,           -- 'Convert' | 'Shopify' | custom
  created_by            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  owner_name            TEXT,
  version               INTEGER NOT NULL DEFAULT 1,
  last_reviewed_at      TIMESTAMPTZ,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Prompt Collections ─────────────────────────────────────────────

CREATE TABLE prompt_collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  visibility  visibility NOT NULL DEFAULT 'internal',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER prompt_collections_updated_at
  BEFORE UPDATE ON prompt_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Prompt Collection Items ────────────────────────────────────────

CREATE TABLE prompt_collection_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES prompt_collections(id) ON DELETE CASCADE,
  prompt_id     UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  UNIQUE (collection_id, prompt_id)
);

CREATE INDEX idx_collection_items_collection ON prompt_collection_items(collection_id);
CREATE INDEX idx_collection_items_prompt ON prompt_collection_items(prompt_id);

-- ── Prompt Submissions ─────────────────────────────────────────────

CREATE TABLE prompt_submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_name    TEXT NOT NULL,
  submitter_email   TEXT NOT NULL,
  title             TEXT NOT NULL,
  short_description TEXT,
  prompt_body       TEXT NOT NULL,
  category          TEXT NOT NULL,
  use_cases         TEXT[] DEFAULT '{}',
  data_sources      TEXT[] DEFAULT '{}',
  notes             TEXT,
  status            submission_status NOT NULL DEFAULT 'pending',
  reviewer_notes    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ
);

CREATE INDEX idx_submissions_status ON prompt_submissions(status);

-- ── Prompt Events ──────────────────────────────────────────────────

CREATE TABLE prompt_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id   UUID REFERENCES prompts(id) ON DELETE SET NULL,
  event_type  event_type NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email  TEXT,
  session_id  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_prompt ON prompt_events(prompt_id);
CREATE INDEX idx_events_type ON prompt_events(event_type);
CREATE INDEX idx_events_created ON prompt_events(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE prompts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_collections   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_events        ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is from convertdigital.com.au
CREATE OR REPLACE FUNCTION is_internal_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email LIKE '%@convertdigital.com.au'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: check if current user is the admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND email = 'tom@convertdigital.com.au'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── Prompts RLS ────────────────────────────────────────────────────

-- Public users: see public + published prompts
CREATE POLICY "Public can read public prompts"
  ON prompts FOR SELECT
  TO anon, authenticated
  USING (visibility = 'public' AND status = 'published');

-- Internal users: see public + internal published prompts
CREATE POLICY "Internal users can read internal prompts"
  ON prompts FOR SELECT
  TO authenticated
  USING (
    is_internal_user()
    AND visibility IN ('public', 'internal')
    AND status = 'published'
  );

-- Admin: see everything
CREATE POLICY "Admin can read all prompts"
  ON prompts FOR SELECT
  TO authenticated
  USING (is_admin_user());

-- Admin: write everything
CREATE POLICY "Admin can insert prompts"
  ON prompts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin can update prompts"
  ON prompts FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Admin can delete prompts"
  ON prompts FOR DELETE
  TO authenticated
  USING (is_admin_user());

-- ── Prompt Collections RLS ─────────────────────────────────────────

CREATE POLICY "Public can read public collections"
  ON prompt_collections FOR SELECT
  TO anon, authenticated
  USING (visibility = 'public');

CREATE POLICY "Internal users can read internal collections"
  ON prompt_collections FOR SELECT
  TO authenticated
  USING (
    is_internal_user()
    AND visibility IN ('public', 'internal')
  );

CREATE POLICY "Admin can read all collections"
  ON prompt_collections FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin can write collections"
  ON prompt_collections FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ── Prompt Collection Items RLS ───────────────────────────────────-

CREATE POLICY "Anyone can read collection items if collection is visible"
  ON prompt_collection_items FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prompt_collections c
      WHERE c.id = collection_id
        AND (
          c.visibility = 'public'
          OR (is_internal_user() AND c.visibility IN ('public', 'internal'))
          OR is_admin_user()
        )
    )
  );

CREATE POLICY "Admin can write collection items"
  ON prompt_collection_items FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ── Prompt Submissions RLS ─────────────────────────────────────────

-- Internal users can submit
CREATE POLICY "Internal users can submit prompts"
  ON prompt_submissions FOR INSERT
  TO authenticated
  WITH CHECK (is_internal_user());

-- Admin can see all submissions
CREATE POLICY "Admin can read all submissions"
  ON prompt_submissions FOR SELECT
  TO authenticated
  USING (is_admin_user());

-- Admin can update submissions (review actions)
CREATE POLICY "Admin can update submissions"
  ON prompt_submissions FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ── Prompt Events RLS ──────────────────────────────────────────────

-- Anyone can insert events
CREATE POLICY "Anyone can insert events"
  ON prompt_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin can read events
CREATE POLICY "Admin can read events"
  ON prompt_events FOR SELECT
  TO authenticated
  USING (is_admin_user());

-- ═══════════════════════════════════════════════════════════════════
-- Claude Skills Library (internal-only)
-- ═══════════════════════════════════════════════════════════════════

-- ── Enums ──────────────────────────────────────────────────────────

CREATE TYPE skill_visibility AS ENUM ('internal', 'draft');
CREATE TYPE skill_status AS ENUM ('published', 'archived', 'draft');
CREATE TYPE skill_submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE skill_submission_type AS ENUM ('new', 'update');

-- ── Skills ─────────────────────────────────────────────────────────

CREATE TABLE skills (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT NOT NULL,
  short_description   TEXT,
  category            TEXT NOT NULL,
  use_cases           TEXT[] NOT NULL DEFAULT '{}',
  owner_name          TEXT,
  visibility          skill_visibility NOT NULL DEFAULT 'internal',
  status              skill_status NOT NULL DEFAULT 'draft',
  is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
  is_recommended      BOOLEAN NOT NULL DEFAULT FALSE,
  created_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  current_version_id  UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Skill Versions ─────────────────────────────────────────────────

CREATE TABLE skill_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  version_label   TEXT,
  changelog       TEXT,
  content_markdown TEXT,
  status          skill_status NOT NULL DEFAULT 'draft',
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (skill_id, version_number)
);

CREATE INDEX idx_skill_versions_skill ON skill_versions(skill_id);
CREATE INDEX idx_skill_versions_created ON skill_versions(created_at DESC);

ALTER TABLE skills
  ADD CONSTRAINT skills_current_version_fk
  FOREIGN KEY (current_version_id)
  REFERENCES skill_versions(id)
  ON DELETE SET NULL;

-- ── Skill Submissions ──────────────────────────────────────────────

CREATE TABLE skill_submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type   skill_submission_type NOT NULL DEFAULT 'new',
  skill_id          UUID REFERENCES skills(id) ON DELETE SET NULL,
  submitted_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitter_name    TEXT NOT NULL,
  submitter_email   TEXT NOT NULL,
  title             TEXT NOT NULL,
  short_description TEXT,
  category          TEXT NOT NULL,
  use_cases         TEXT[] NOT NULL DEFAULT '{}',
  owner_name        TEXT,
  version_number    INTEGER,
  version_label     TEXT,
  changelog         TEXT,
  content_markdown  TEXT,
  status            skill_submission_status NOT NULL DEFAULT 'pending',
  reviewer_notes    TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       TIMESTAMPTZ
);

CREATE INDEX idx_skill_submissions_status ON skill_submissions(status);
CREATE INDEX idx_skill_submissions_skill ON skill_submissions(skill_id);

-- ── Skill Files ────────────────────────────────────────────────────

CREATE TABLE skill_files (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id         UUID REFERENCES skills(id) ON DELETE CASCADE,
  skill_version_id UUID REFERENCES skill_versions(id) ON DELETE CASCADE,
  submission_id    UUID REFERENCES skill_submissions(id) ON DELETE CASCADE,
  file_name        TEXT NOT NULL,
  storage_path     TEXT NOT NULL,
  mime_type        TEXT,
  file_size_bytes  BIGINT,
  uploaded_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_files_skill ON skill_files(skill_id);
CREATE INDEX idx_skill_files_version ON skill_files(skill_version_id);
CREATE INDEX idx_skill_files_submission ON skill_files(submission_id);

-- ── Skills RLS ─────────────────────────────────────────────────────

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_files ENABLE ROW LEVEL SECURITY;

-- Internal users can read published internal skills
CREATE POLICY "Internal users can read skills"
  ON skills FOR SELECT
  TO authenticated
  USING (
    is_internal_user()
    AND visibility = 'internal'
    AND status = 'published'
  );

CREATE POLICY "Admin can read all skills"
  ON skills FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin can write skills"
  ON skills FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Internal users can read published skill versions"
  ON skill_versions FOR SELECT
  TO authenticated
  USING (
    is_internal_user()
    AND EXISTS (
      SELECT 1
      FROM skills s
      WHERE s.id = skill_id
        AND s.visibility = 'internal'
        AND s.status = 'published'
    )
  );

CREATE POLICY "Admin can read all skill versions"
  ON skill_versions FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin can write skill versions"
  ON skill_versions FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Internal users can submit skills"
  ON skill_submissions FOR INSERT
  TO authenticated
  WITH CHECK (is_internal_user());

CREATE POLICY "Admin can read all skill submissions"
  ON skill_submissions FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin can update skill submissions"
  ON skill_submissions FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Internal users can read skill files"
  ON skill_files FOR SELECT
  TO authenticated
  USING (is_internal_user());

CREATE POLICY "Admin can write skill files"
  ON skill_files FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- ── Storage bucket and policies (skills files) ─────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('skills-files', 'skills-files', FALSE);

CREATE POLICY "Internal users can read skills files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'skills-files'
    AND is_internal_user()
  );

CREATE POLICY "Internal users can upload skills files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'skills-files'
    AND is_internal_user()
  );

CREATE POLICY "Internal users can update skills files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'skills-files'
    AND is_internal_user()
  )
  WITH CHECK (
    bucket_id = 'skills-files'
    AND is_internal_user()
  );

CREATE POLICY "Admin can delete skills files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'skills-files'
    AND is_admin_user()
  );
