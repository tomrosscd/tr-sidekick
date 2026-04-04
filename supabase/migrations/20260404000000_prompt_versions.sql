-- ═══════════════════════════════════════════════════════════════════
-- Migration: Prompt Versions
-- Date: 2026-04-04
--
-- Adds prompt_versions as a child table of prompts, mirroring the
-- skill_versions pattern already in the schema. Each row is a
-- point-in-time snapshot of a prompt's body + metadata.
--
-- Steps:
--   1. Create prompt_versions table
--   2. Add current_version_id FK to prompts
--   3. Backfill version 1 for every existing prompt
--   4. Point current_version_id at the backfilled row
--   5. Enable RLS + create access policies
-- ═══════════════════════════════════════════════════════════════════


-- ── 1. Create table ────────────────────────────────────────────────

CREATE TABLE prompt_versions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id        UUID        NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number   INTEGER     NOT NULL,
  prompt_body      TEXT        NOT NULL,
  change_notes     TEXT,                          -- brief changelog / reason for edit
  created_by       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by_name  TEXT,                          -- display name; stored so we avoid joining auth.users
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (prompt_id, version_number)
);

CREATE INDEX idx_prompt_versions_prompt  ON prompt_versions(prompt_id);
CREATE INDEX idx_prompt_versions_created ON prompt_versions(created_at DESC);


-- ── 2. Add current_version_id to prompts ──────────────────────────
-- Nullable: NULL means "no explicit version pinned yet" (falls back
-- to the max version_number row). Set to NOT NULL after backfill.

ALTER TABLE prompts
  ADD COLUMN current_version_id UUID REFERENCES prompt_versions(id) ON DELETE SET NULL;


-- ── 3. Backfill — version 1 for every existing prompt ─────────────
-- Use the prompt's existing `version` counter as version_number,
-- and `owner_name` as the display author.

INSERT INTO prompt_versions
  (prompt_id, version_number, prompt_body, change_notes, created_by_name, created_at)
SELECT
  id,
  COALESCE(version, 1),   -- existing integer version counter
  prompt_body,
  'Initial version',
  COALESCE(owner_name, 'Convert Digital'),
  created_at              -- preserve original creation timestamp
FROM prompts;


-- ── 4. Point current_version_id at the backfilled row ─────────────

UPDATE prompts p
SET    current_version_id = pv.id
FROM   prompt_versions pv
WHERE  pv.prompt_id      = p.id
  AND  pv.version_number = COALESCE(p.version, 1);


-- ── 5. RLS ────────────────────────────────────────────────────────

ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;

-- Public: versions of public + published prompts
CREATE POLICY "Public can read versions of public prompts"
  ON prompt_versions FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prompts p
      WHERE  p.id         = prompt_id
        AND  p.visibility = 'public'
        AND  p.status     = 'published'
    )
  );

-- Internal: versions of public + internal published prompts
CREATE POLICY "Internal users can read versions of internal prompts"
  ON prompt_versions FOR SELECT
  TO authenticated
  USING (
    is_internal_user()
    AND EXISTS (
      SELECT 1 FROM prompts p
      WHERE  p.id           = prompt_id
        AND  p.visibility   IN ('public', 'internal')
        AND  p.status       = 'published'
    )
  );

-- Admin: unrestricted read
CREATE POLICY "Admin can read all prompt versions"
  ON prompt_versions FOR SELECT
  TO authenticated
  USING (is_admin_user());

-- Admin: full write
CREATE POLICY "Admin can write prompt versions"
  ON prompt_versions FOR ALL
  TO authenticated
  USING    (is_admin_user())
  WITH CHECK (is_admin_user());
