'use client'

/**
 * Design System / Style Guide
 * Internal review page — not linked from the main nav.
 * Shows all three style systems side by side:
 *   1. Convert  — public pages, admin, footer
 *   2. Sidekick — logged-in prompt library
 *   3. Claude   — logged-in /skills library
 */

import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { PromptCard } from '@/components/PromptCard'
import { SkillCard } from '@/components/SkillCard'
import { Badge } from '@/components/ui/badge'
import type { Prompt, Skill } from '@/types'

// ── Sample data ──────────────────────────────────────────────────────────────

const samplePrompt: Prompt = {
  id: 'ds-1',
  slug: 'ds-sample-prompt',
  title: 'Category performance pulse check',
  short_description: 'Identify category movement, conversion shifts, and where to dig deeper.',
  prompt_body: 'Review conversion performance for {{TF}} vs {{CMP}}. Highlight top movers and likely root causes.',
  category: 'CRO',
  use_cases: ['weekly-review', 'opportunity-discovery'],
  data_sources: ['GA4', 'Shopify'],
  output_types: [], business_objectives: [], funnel_stages: [],
  level: 'intermediate', visibility: 'public', status: 'published',
  when_to_use: null, caveats: null, follow_up_prompt_ids: [],
  is_featured: true, is_recommended: false,
  source_label: 'Convert', created_by: null, reviewed_by: null,
  owner_name: 'Performance Team', version: 1, current_version_id: null,
  last_reviewed_at: null, published_at: null,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

const sampleSkill: Skill = {
  id: 'ds-skill-1', slug: 'ds-analytics-skill',
  title: 'Analytics audit skill',
  short_description: 'Rapid analytics sanity checks and audit summaries for any client.',
  category: 'Analytics', use_cases: ['monthly-reporting', 'qa-validation'],
  owner_name: 'Data Team', visibility: 'internal', status: 'published',
  is_featured: true, is_recommended: false,
  created_by: null, updated_by: null, current_version_id: null,
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

// ── Helper components ─────────────────────────────────────────────────────────

function SystemHeader({ label, description }: { label: string; description: string }) {
  return (
    <div className="mb-6 pb-4 border-b border-[var(--shell-border)]">
      <h2 className="type-h2 mb-1">{label}</h2>
      <p className="type-body-sm">{description}</p>
    </div>
  )
}

function Swatch({ label, value, bg, fg = '#fff', border }: {
  label: string; value: string; bg: string; fg?: string; border?: string
}) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: border ? `1px solid ${border}` : undefined }}>
      <div className="h-10" style={{ background: bg }} />
      <div className="px-2.5 py-2" style={{ background: bg }}>
        <div className="text-[11px] font-[700]" style={{ color: fg, opacity: 0.65 }}>{label}</div>
        <div className="text-[11px] font-[800] font-mono" style={{ color: fg }}>{value}</div>
      </div>
    </div>
  )
}

function TypeRow({ family, size, weight, label, color }: {
  family: string; size: string; weight: number; label: string; color: string
}) {
  return (
    <div className="flex items-baseline gap-5 py-2 border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
      <span className="text-[11px] font-mono w-44 shrink-0" style={{ color, opacity: 0.5 }}>{label}</span>
      <span style={{ fontFamily: family, fontSize: size, fontWeight: weight, color, lineHeight: 1.15 }}>
        The quick brown fox jumps
      </span>
    </div>
  )
}

function FilterDemo({ variant }: { variant: 'convert' | 'sidekick' | 'claude' }) {
  const tabs = ['All 54', 'CRO 18', 'LTV 12', 'Strategy 9', 'BFCM 8']
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
      {/* Tab row */}
      <div className="flex overflow-x-auto scrollbar-none border-b" style={{ background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-border)' }}>
        {tabs.map((tab, i) => {
          const [name, count] = tab.split(' ')
          return (
            <div key={tab}
              className="px-4 py-3.5 flex items-center gap-1.5 whitespace-nowrap border-b-2 shrink-0"
              style={i === 0 ? {
                fontWeight: 800,
                fontSize: '0.9375rem',
                color: 'var(--filter-tab-active-fg)',
                borderBottomColor: 'var(--filter-tab-active-border)',
                background: 'var(--filter-tab-active-bg)',
              } : {
                fontWeight: 600,
                fontSize: '0.9375rem',
                color: 'var(--filter-tab-inactive-fg)',
                borderBottomColor: 'transparent',
              }}>
              {name}
              <span className="text-[11px] font-[900] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full"
                style={{ background: 'var(--filter-chip-bg)', color: 'var(--filter-chip-fg)' }}>
                {count}
              </span>
            </div>
          )
        })}
      </div>
      {/* Search row */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'var(--filter-bar-bg)' }}>
        <div className="flex-1 h-9 rounded-lg px-3 flex items-center text-[13px] font-[600] border"
          style={{ borderColor: 'var(--filter-input-border)', background: 'var(--filter-bar-bg)', color: 'var(--filter-tab-inactive-fg)' }}>
          Search prompts…
        </div>
        <div className="h-9 px-3.5 rounded-lg text-[13px] font-[700] flex items-center border"
          style={{ background: 'var(--filter-btn-active-bg)', color: 'var(--filter-btn-active-fg)', border: 'none' }}>
          Filters
        </div>
        <div className="h-9 px-3.5 rounded-lg text-[13px] font-[600] flex items-center border"
          style={{ borderColor: 'var(--filter-input-border)', background: 'var(--filter-bar-bg)', color: 'var(--filter-tab-inactive-fg)' }}>
          Clear
        </div>
      </div>
    </div>
  )
}

function ButtonDemo({ variant }: { variant: 'convert' | 'sidekick' | 'claude' }) {
  const accentBg = `var(--library-accent)`
  return (
    <div className="flex flex-wrap gap-2">
      <button className="h-10 px-5 rounded-lg text-[14px] font-[700] text-white transition-opacity hover:opacity-90"
        style={{ background: accentBg }}>
        Primary
      </button>
      <button className="h-10 px-5 rounded-lg text-[14px] font-[600] border transition-colors"
        style={{ borderColor: 'var(--card-border)', color: 'var(--shell-fg)', background: 'var(--library-surface)' }}>
        Secondary
      </button>
      <button className="h-9 px-4 rounded-full text-[13px] font-[700] border transition-colors"
        style={{ borderColor: 'var(--filter-input-border)', color: 'var(--shell-muted-fg)', background: 'var(--library-surface)' }}>
        Chip
      </button>
      <span className="h-5 px-2.5 rounded-full text-[11px] font-[900] uppercase tracking-[0.06em] flex items-center"
        style={{ background: 'var(--library-chip-bg)', color: 'var(--library-chip-fg)' }}>
        Badge
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function DesignSystemPage() {
  return (
    <TimeframeProvider>
      <Header showTimeframe={false} />

      <main className="max-w-[1400px] mx-auto px-5 py-10 pb-20" style={{ background: 'var(--shell-bg)' }}>

        {/* Page header */}
        <div className="max-w-2xl mb-12">
          <h1 className="type-h1 mb-3">Style guide</h1>
          <p className="type-body" style={{ color: 'var(--shell-muted-fg)' }}>
            Three independent style systems share one shell. Section/audience controls which
            is active via <code className="font-mono text-[0.85em] px-1 rounded bg-[var(--shell-muted)]">data-library</code> on{' '}
            <code className="font-mono text-[0.85em] px-1 rounded bg-[var(--shell-muted)]">&lt;html&gt;</code>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-caption">
            {[
              ['convert',  'Public + admin + footer'],
              ['sidekick', 'Logged-in prompt library'],
              ['claude',   'Logged-in /skills'],
            ].map(([lib, desc]) => (
              <span key={lib} className="px-3 py-1 rounded-full font-[700]"
                style={{ background: 'var(--shell-muted)', color: 'var(--shell-muted-fg)' }}>
                <span className="font-[900]">{lib}</span> — {desc}
              </span>
            ))}
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ═══════════════════════════════
              CONVERT
              ═══════════════════════════════ */}
          <section className="librarytokens-convert rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--cv-border)', background: 'var(--cv-bg)' }}>

            {/* Section header strip */}
            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ background: 'var(--cv-header)', borderColor: 'transparent' }}>
              <span className="text-[13px] font-[800] uppercase tracking-[0.1em] text-white/80">Convert</span>
              <span className="text-[11px] text-white/50">public · admin · footer</span>
            </div>

            <div className="p-5 space-y-7">

              {/* Typography */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Typography</p>
                <div className="space-y-0">
                  <TypeRow family="'Instrument Serif', Georgia, serif" size="2.375rem" weight={400}
                    label="display / h1 — IS 400" color="var(--cv-text)" />
                  <TypeRow family="'Instrument Serif', Georgia, serif" size="1.75rem" weight={400}
                    label="h2 — IS 400" color="var(--cv-text)" />
                  <TypeRow family="'Darker Grotesque', system-ui, sans-serif" size="1.1875rem" weight={700}
                    label="h3 — DG 700" color="var(--cv-text)" />
                  <TypeRow family="'Darker Grotesque', system-ui, sans-serif" size="1.0625rem" weight={500}
                    label="body — DG 500" color="var(--cv-text)" />
                  <TypeRow family="'Darker Grotesque', system-ui, sans-serif" size="0.9375rem" weight={500}
                    label="body-sm — DG 500" color="var(--cv-text-muted)" />
                  <TypeRow family="'Darker Grotesque', system-ui, sans-serif" size="0.8125rem" weight={600}
                    label="caption — DG 600" color="var(--cv-text-muted)" />
                </div>
              </div>

              {/* Colours */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Colours</p>
                <div className="grid grid-cols-3 gap-2">
                  <Swatch label="--cv-header" value="#27382F" bg="#27382f" />
                  <Swatch label="--cv-bg" value="#FAF9F7" bg="#faf9f7" fg="#27382f" border="#d8e4da" />
                  <Swatch label="--cv-surface" value="#FFFFFF" bg="#ffffff" fg="#27382f" border="#d8e4da" />
                  <Swatch label="--cv-fg" value="#499E6B" bg="#499e6b" />
                  <Swatch label="--cv-lg" value="#C9DEB6" bg="#c9deb6" fg="#27382f" />
                  <Swatch label="--cv-text" value="#1E2B25" bg="#1e2b25" />
                </div>
              </div>

              {/* Buttons */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Controls</p>
                <ButtonDemo variant="convert" />
              </div>

              {/* Filters */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Filters</p>
                <FilterDemo variant="convert" />
              </div>

              {/* Card */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Card</p>
                <PromptCard prompt={samplePrompt} />
              </div>

              {/* Badges */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Badges + pills</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="featured">Featured</Badge>
                  <Badge variant="recommended">Recommended</Badge>
                  <span className="meta-pill pill-CRO">CRO</span>
                  <span className="meta-pill pill-LTV">LTV</span>
                  <span className="meta-pill pill-Strategy">Strategy</span>
                </div>
              </div>

              {/* Footer preview */}
              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cv-text-muted)' }}>Footer</p>
                <div data-style-system="convert" className="convert-footer rounded-xl overflow-hidden">
                  <div className="px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <img src="/logos/Convert_Logo_Dark Green.svg" alt="Convert" className="h-4 mb-1.5" />
                      <p className="convert-footer__body">Built by Convert Digital</p>
                    </div>
                    <a href="#" className="convert-footer__link inline-flex h-9 items-center rounded-full px-4">
                      Visit Convert
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ═══════════════════════════════
              SIDEKICK
              ═══════════════════════════════ */}
          <section className="librarytokens-sidekick rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--sk-border)', background: 'var(--sk-bg)' }}>

            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ background: 'var(--sk-header)', borderColor: 'transparent' }}>
              <span className="text-[13px] font-[800] uppercase tracking-[0.1em] text-white/80">Sidekick</span>
              <span className="text-[11px] text-white/50">logged-in prompts</span>
            </div>

            <div className="p-5 space-y-7">

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Typography</p>
                <div className="space-y-0">
                  <TypeRow family="'Inter', system-ui, sans-serif" size="2.375rem" weight={700}
                    label="display / h1 — Inter 700" color="var(--sk-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.75rem" weight={700}
                    label="h2 — Inter 700" color="var(--sk-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.1875rem" weight={700}
                    label="h3 — Inter 700" color="var(--sk-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.0625rem" weight={500}
                    label="body — Inter 500" color="var(--sk-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="0.9375rem" weight={500}
                    label="body-sm — Inter 500" color="var(--sk-text-muted)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="0.8125rem" weight={600}
                    label="caption — Inter 600" color="var(--sk-text-muted)" />
                </div>
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Colours</p>
                <div className="grid grid-cols-3 gap-2">
                  <Swatch label="--sk-header" value="#1E1B3A" bg="#1e1b3a" />
                  <Swatch label="--sk-bg" value="#F0F0F8" bg="#f0f0f8" fg="#0f0e1a" border="#d5d3ec" />
                  <Swatch label="--sk-surface" value="#FFFFFF" bg="#ffffff" fg="#0f0e1a" border="#d5d3ec" />
                  <Swatch label="--sk-accent" value="#5C4DE6" bg="#5c4de6" />
                  <Swatch label="--sk-chip-bg" value="#E4E1F7" bg="#e4e1f7" fg="#3d34a5" border="#b5b0e0" />
                  <Swatch label="--sk-text" value="#0F0E1A" bg="#0f0e1a" />
                </div>
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Controls</p>
                <ButtonDemo variant="sidekick" />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Filters</p>
                <FilterDemo variant="sidekick" />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Card</p>
                <PromptCard prompt={samplePrompt} />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--sk-text-muted)' }}>Badges + pills</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="featured">Featured</Badge>
                  <Badge variant="recommended">Recommended</Badge>
                  <span className="meta-pill pill-CRO">CRO</span>
                  <span className="meta-pill pill-LTV">LTV</span>
                  <span className="meta-pill pill-Strategy">Strategy</span>
                </div>
              </div>

            </div>
          </section>

          {/* ═══════════════════════════════
              CLAUDE SKILLS
              ═══════════════════════════════ */}
          <section className="librarytokens-claude rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--cl-border)', background: 'var(--cl-bg)' }}>

            <div className="px-5 py-3 border-b flex items-center justify-between"
              style={{ background: 'var(--cl-header)', borderColor: 'var(--cl-border)' }}>
              <span className="text-[13px] font-[700] tracking-[0.01em]" style={{ color: 'var(--cl-text)' }}>
                Claude Skills
              </span>
              <span className="text-[11px]" style={{ color: 'var(--cl-text-muted)' }}>logged-in /skills</span>
            </div>

            <div className="p-5 space-y-7">

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Typography</p>
                <div className="space-y-0">
                  <TypeRow family="'Source Serif 4', Georgia, serif" size="2.375rem" weight={400}
                    label="display — SS4 400 (editorial)" color="var(--cl-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.75rem" weight={600}
                    label="h1/h2 — Inter 600" color="var(--cl-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.1875rem" weight={600}
                    label="h3 — Inter 600" color="var(--cl-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="1.0625rem" weight={400}
                    label="body — Inter 400" color="var(--cl-text)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="0.9375rem" weight={400}
                    label="body-sm — Inter 400" color="var(--cl-text-muted)" />
                  <TypeRow family="'Inter', system-ui, sans-serif" size="0.8125rem" weight={500}
                    label="caption — Inter 500" color="var(--cl-text-muted)" />
                </div>
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Colours</p>
                <div className="grid grid-cols-3 gap-2">
                  <Swatch label="--cl-header" value="#F5F2EE" bg="#f5f2ee" fg="#1f1a14" border="#ddd7cf" />
                  <Swatch label="--cl-bg" value="#EFEBE4" bg="#efebe4" fg="#1f1a14" border="#ddd7cf" />
                  <Swatch label="--cl-surface" value="#FFFFFF" bg="#ffffff" fg="#1f1a14" border="#ddd7cf" />
                  <Swatch label="--cl-accent" value="#C96442" bg="#c96442" />
                  <Swatch label="--cl-chip-bg" value="#F0EBE2" bg="#f0ebe2" fg="#4a3728" border="#ddd7cf" />
                  <Swatch label="--cl-text" value="#1F1A14" bg="#1f1a14" />
                </div>
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Controls</p>
                <ButtonDemo variant="claude" />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Filters</p>
                <FilterDemo variant="claude" />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Card</p>
                <SkillCard skill={sampleSkill} />
              </div>

              <div>
                <p className="text-label mb-3" style={{ color: 'var(--cl-text-muted)' }}>Badges + pills</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="featured">Featured</Badge>
                  <Badge variant="recommended">Recommended</Badge>
                  <span className="meta-pill" style={{ background: 'var(--cl-chip-count-bg)', color: 'var(--cl-chip-count-fg)' }}>Analytics</span>
                  <span className="meta-pill" style={{ background: 'var(--cl-chip-count-bg)', color: 'var(--cl-chip-count-fg)' }}>Automation</span>
                </div>
              </div>

            </div>
          </section>

        </div>{/* end grid */}

        {/* ── Semantic variable map ── */}
        <section className="mt-14">
          <h2 className="type-h2 mb-2">Semantic variable map</h2>
          <p className="type-body-sm mb-6" style={{ color: 'var(--shell-muted-fg)' }}>
            These shell/filter/card variables remap from the active namespace on each library switch.
          </p>
          <div className="surface-card overflow-x-auto">
            <table className="w-full text-caption">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--card-border)', background: 'var(--library-surface-muted)' }}>
                  {['Semantic var', 'Convert value', 'Sidekick value', 'Claude value', 'Purpose'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-label font-[800] uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['--shell-bg',         '--cv-bg #faf9f7',      '--sk-bg #f0f0f8',    '--cl-bg #efebe4',   'Page background'],
                  ['--shell-header-bg',  '--cv-header #27382f',  '--sk-header #1e1b3a','--cl-header #f5f2ee','Top nav'],
                  ['--shell-fg',         '--cv-text #1e2b25',    '--sk-text #0f0e1a',  '--cl-text #1f1a14', 'Primary text'],
                  ['--library-accent',   '--cv-fg #499e6b',      '--sk-accent #5c4de6','--cl-accent #c96442','CTA / active'],
                  ['--library-surface',  '--cv-surface',         '--sk-surface',       '--cl-surface',      'Card surface'],
                  ['--card-border',      '--cv-border-strong',   '--sk-border-strong', '--cl-border',       'Card border'],
                  ['--filter-tab-active-border', '--cv-fg',      '--sk-accent',        '--cl-accent',       'Tab underline'],
                  ['--filter-btn-active-bg','--cv-dg',           '--sk-accent',        '--cl-accent',       'Active button'],
                ].map(([v, cv, sk, cl, purpose], i) => (
                  <tr key={v} className="border-b" style={{
                    borderColor: 'var(--card-border)',
                    background: i % 2 === 0 ? 'var(--library-surface)' : 'var(--library-surface-muted)'
                  }}>
                    <td className="px-4 py-2.5 font-mono text-[12px] font-[700]" style={{ color: 'var(--shell-fg)' }}>{v}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--cv-fg)' }}>{cv}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--sk-accent)' }}>{sk}</td>
                    <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--cl-accent)' }}>{cl}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--shell-muted-fg)' }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </TimeframeProvider>
  )
}
