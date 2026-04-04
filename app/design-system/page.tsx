'use client'

import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { PromptCard } from '@/components/PromptCard'
import { SkillCard } from '@/components/SkillCard'
import { Badge } from '@/components/ui/badge'
import type { Prompt, Skill } from '@/types'

// ── Sample data ─────────────────────────────────────────────────────────────

const samplePrompt: Prompt = {
  id: 'sample-1',
  slug: 'sample-prompt',
  title: 'Category performance pulse check',
  short_description: 'Identify category movement, conversion shifts, and where to investigate further.',
  prompt_body: 'Review conversion performance for {{TF}} and compare against {{CMP}}. Highlight top movers and likely causes.',
  category: 'CRO',
  use_cases: ['weekly-review', 'opportunity-discovery'],
  data_sources: ['GA4', 'Shopify'],
  output_types: [],
  business_objectives: [],
  funnel_stages: [],
  level: 'intermediate',
  visibility: 'public',
  status: 'published',
  when_to_use: 'Use this during recurring review cycles to prioritise deeper analysis.',
  caveats: 'Check tracking quality before acting on small deltas.',
  follow_up_prompt_ids: [],
  is_featured: true,
  is_recommended: true,
  source_label: 'Convert',
  created_by: null,
  reviewed_by: null,
  owner_name: 'Performance Team',
  version: 1,
  current_version_id: null,
  last_reviewed_at: null,
  published_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const sampleSkill: Skill = {
  id: 'skill-1',
  slug: 'analytics-audit-skill',
  title: 'Analytics audit skill',
  short_description: 'A reusable Claude Skill for rapid analytics sanity checks and audit summaries.',
  category: 'Analytics',
  use_cases: ['monthly-reporting', 'qa-validation'],
  owner_name: 'Data Team',
  visibility: 'internal',
  status: 'published',
  is_featured: true,
  is_recommended: false,
  created_by: null,
  updated_by: null,
  current_version_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function PageSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-5">
      <h2 className="type-h2 border-b pb-3" style={{ borderColor: 'var(--shell-border)' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function TokenSwatch({ label, value, bg, fg = '#fff', border }: {
  label: string
  value: string
  bg: string
  fg?: string
  border?: string
}) {
  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-1"
      style={{ background: bg, border: border ? `1px solid ${border}` : undefined }}
    >
      <span className="text-[11px] font-[700] uppercase tracking-[0.06em]" style={{ color: fg, opacity: 0.7 }}>{label}</span>
      <span className="text-[12px] font-[800] font-mono" style={{ color: fg }}>{value}</span>
    </div>
  )
}

function TypeScale({ fontFamily, weights, color }: {
  fontFamily: string
  weights: number[]
  color: string
}) {
  return (
    <div className="space-y-2">
      {[
        { label: 'Display · 48px', size: '48px', weight: weights[0] },
        { label: 'H1 · 36px', size: '36px', weight: weights[0] },
        { label: 'H2 · 28px', size: '28px', weight: weights[0] },
        { label: 'H3 · 22px', size: '22px', weight: weights[0] },
        { label: 'Body · 17px', size: '17px', weight: weights[1] },
        { label: 'Body SM · 15px', size: '15px', weight: weights[1] },
        { label: 'Caption · 13px', size: '13px', weight: weights[1] },
      ].map(({ label, size, weight }) => (
        <div key={label} className="flex items-baseline gap-4">
          <span className="text-[11px] font-mono w-36 shrink-0 opacity-50" style={{ color }}>{label}</span>
          <span style={{ fontFamily, fontSize: size, fontWeight: weight, color, lineHeight: 1.2 }}>
            The quick brown fox
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <TimeframeProvider>
      <Header showTimeframe={false} />

      <main className="max-w-[1280px] mx-auto px-5 py-10 pb-20 space-y-16" style={{ background: 'var(--shell-bg)' }}>

        {/* ── Intro ── */}
        <header className="max-w-3xl space-y-3">
          <h1 className="type-h1">Design system</h1>
          <p className="text-body text-[var(--shell-muted-fg)] font-[600] leading-relaxed">
            Three style systems share one Next.js app. The active library is set via{' '}
            <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-[var(--shell-muted)]">data-library</code> on{' '}
            <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-[var(--shell-muted)]">&lt;html&gt;</code>.
            Semantic variables (<code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-[var(--shell-muted)]">--shell-*</code>,{' '}
            <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-[var(--shell-muted)]">--filter-*</code>)
            remap from the active namespace.
            The footer always uses <code className="font-mono text-[0.85em] px-1 py-0.5 rounded bg-[var(--shell-muted)]">--cv-*</code>.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Sidekick: /prompts → data-library=sidekick', 'Claude Skills: /skills → data-library=claude', 'Footer: always --cv-* (Convert)'].map(s => (
              <span key={s} className="text-caption font-[700] px-3 py-1 rounded-full" style={{ background: 'var(--shell-muted)', color: 'var(--shell-muted-fg)' }}>{s}</span>
            ))}
          </div>
        </header>

        {/* ══════════════════════════════════
            1. CONVERT
        ══════════════════════════════════ */}
        <PageSection id="convert" title="Convert — editorial system">
          <p className="text-body-sm text-[var(--shell-muted-fg)] font-[600]">
            Instrument Serif + Darker Grotesque on cream. Warm, premium, editorial. Used in the footer and any Convert marketing surfaces.
            Tokens: <code className="font-mono text-[0.85em]">--cv-*</code>
          </p>

          {/* Type scale */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cv-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cv-cream)', borderColor: 'var(--cv-border)', color: 'var(--cv-muted)' }}>
              Typography
            </div>
            <div className="p-6 space-y-6" style={{ background: 'var(--cv-cream)' }}>
              <div>
                <p className="text-caption font-[700] mb-3 uppercase tracking-[0.06em]" style={{ color: 'var(--cv-muted)' }}>Instrument Serif — headings</p>
                <TypeScale fontFamily="'Instrument Serif', Georgia, serif" weights={[400, 400]} color="var(--cv-dg)" />
              </div>
              <div>
                <p className="text-caption font-[700] mb-3 uppercase tracking-[0.06em]" style={{ color: 'var(--cv-muted)' }}>Darker Grotesque — body + UI</p>
                <TypeScale fontFamily="'Darker Grotesque', system-ui, sans-serif" weights={[700, 600]} color="var(--cv-text)" />
              </div>
            </div>
          </div>

          {/* Colour swatches */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cv-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cv-cream)', borderColor: 'var(--cv-border)', color: 'var(--cv-muted)' }}>
              Colour tokens
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" style={{ background: 'var(--cv-cream)' }}>
              <TokenSwatch label="--cv-cream" value="#FAF9F7" bg="#faf9f7" fg="#27382f" border="#e4ede8" />
              <TokenSwatch label="--cv-dg" value="#27382F" bg="#27382f" fg="#faf9f7" />
              <TokenSwatch label="--cv-lg" value="#C9DEB6" bg="#c9deb6" fg="#27382f" />
              <TokenSwatch label="--cv-fg" value="#499E6B" bg="#499e6b" fg="#fff" />
              <TokenSwatch label="--cv-text" value="#3C4840" bg="#3c4840" fg="#faf9f7" />
              <TokenSwatch label="--cv-muted" value="#7A8A84" bg="#7a8a84" fg="#fff" />
            </div>
          </div>

          {/* Component preview */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cv-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cv-cream)', borderColor: 'var(--cv-border)', color: 'var(--cv-muted)' }}>
              Component preview
            </div>
            <div className="p-6 space-y-5" style={{ background: 'var(--cv-cream)' }}>
              <div className="space-y-1.5">
                <h2 className="font-serif text-h2" style={{ color: 'var(--cv-dg)' }}>Editorial heading</h2>
                <p className="font-sans text-body" style={{ color: 'var(--cv-text)', fontWeight: 600 }}>
                  Darker Grotesque body copy. Warm cream background with dark-green headings and forest-green accents for a premium editorial feel.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <span className="rounded-full px-3 py-1 text-caption font-[800]" style={{ background: 'var(--cv-lg)', color: 'var(--cv-dg)' }}>Accent pill</span>
                <button
                  type="button"
                  className="h-9 rounded-full px-4 text-caption font-[700] border transition-colors"
                  style={{ borderColor: 'var(--cv-border)', color: 'var(--cv-dg)', background: 'var(--cv-elevated)' }}
                >
                  Outline control
                </button>
                <button
                  type="button"
                  className="h-9 rounded-full px-4 text-caption font-[700] transition-colors"
                  style={{ background: 'var(--cv-dg)', color: 'var(--cv-cream)' }}
                >
                  Primary action
                </button>
              </div>
            </div>
            {/* Actual Convert footer preview */}
            <footer data-style-system="convert" className="convert-footer mt-0">
              <div className="px-6 py-5 max-w-none flex items-center justify-between gap-4">
                <div>
                  <img src="/logos/Convert_Logo_Dark Green.svg" alt="Convert" className="h-4 w-auto mb-1.5" />
                  <p className="convert-footer__body">Footer sample — always uses --cv-* tokens only.</p>
                </div>
                <a href="#" className="convert-footer__link inline-flex h-9 items-center rounded-full px-4">Visit Convert Digital</a>
              </div>
            </footer>
          </div>
        </PageSection>

        {/* ══════════════════════════════════
            2. SIDEKICK
        ══════════════════════════════════ */}
        <PageSection id="sidekick" title="Sidekick — product UI system">
          <p className="text-body-sm text-[var(--shell-muted-fg)] font-[600]">
            Inter throughout. High-contrast utility UI — strong filter tabs, visible borders, dark header strip.
            Tokens: <code className="font-mono text-[0.85em]">--sk-*</code>
          </p>

          {/* Type scale */}
          <div className="librarytokens-sidekick rounded-xl border overflow-hidden" style={{ borderColor: 'var(--sk-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--sk-surface)', borderColor: 'var(--sk-border)', color: 'var(--sk-text-muted)' }}>
              Typography — Inter only
            </div>
            <div className="p-6" style={{ background: 'var(--sk-bg)' }}>
              <TypeScale fontFamily="'Inter', system-ui, sans-serif" weights={[700, 500]} color="var(--sk-text)" />
            </div>
          </div>

          {/* Colour swatches */}
          <div className="librarytokens-sidekick rounded-xl border overflow-hidden" style={{ borderColor: 'var(--sk-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--sk-surface)', borderColor: 'var(--sk-border)', color: 'var(--sk-text-muted)' }}>
              Colour tokens
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" style={{ background: 'var(--sk-bg)' }}>
              <TokenSwatch label="--sk-header" value="#1A2520" bg="#1a2520" fg="#fff" />
              <TokenSwatch label="--sk-bg" value="#E4EBE7" bg="#e4ebe7" fg="#0f1814" border="#b5c4bb" />
              <TokenSwatch label="--sk-surface" value="#FFFFFF" bg="#ffffff" fg="#0f1814" border="#b5c4bb" />
              <TokenSwatch label="--sk-accent" value="#2D7A57" bg="#2d7a57" fg="#fff" />
              <TokenSwatch label="--sk-text" value="#0F1814" bg="#0f1814" fg="#e4ebe7" />
              <TokenSwatch label="--sk-border" value="#B5C4BB" bg="#b5c4bb" fg="#0f1814" />
            </div>
          </div>

          {/* Filter + card preview */}
          <div className="librarytokens-sidekick rounded-xl border overflow-hidden" style={{ borderColor: 'var(--sk-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--sk-surface)', borderColor: 'var(--sk-border)', color: 'var(--sk-text-muted)' }}>
              Component preview
            </div>

            {/* Header strip */}
            <div className="h-12 px-5 flex items-center justify-between" style={{ background: 'var(--sk-header)' }}>
              <span className="text-caption font-[800] text-white/90">Sidekick header</span>
              <span className="h-7 px-3 rounded-full text-[11px] font-[700] text-white/75 border border-white/20 flex items-center">Sign in</span>
            </div>

            {/* Filter bar preview */}
            <div style={{ background: 'var(--filter-bar-bg)', borderBottom: '1px solid var(--filter-border)' }}>
              <div className="flex items-stretch overflow-x-auto scrollbar-none border-b" style={{ borderColor: 'var(--filter-border)' }}>
                {['All 18', 'CRO 7', 'LTV 4', 'Strategy 3', 'BFCM 4'].map((tab, i) => (
                  <button
                    key={tab}
                    className="px-4 py-3.5 text-body-sm whitespace-nowrap border-b-2 border-transparent flex-shrink-0 flex items-center gap-[5px]"
                    style={i === 0 ? {
                      fontWeight: 800,
                      color: 'var(--filter-tab-active-fg)',
                      borderBottomColor: 'var(--filter-tab-active-border)',
                      background: 'var(--filter-tab-active-bg)',
                    } : {
                      fontWeight: 700,
                      color: 'var(--filter-tab-inactive-fg)',
                    }}
                  >
                    {tab.split(' ')[0]}
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-[7px] text-[11px] font-[900]"
                      style={{ background: 'var(--filter-chip-bg)', color: 'var(--filter-chip-fg)' }}>
                      {tab.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="h-10 flex-1 min-w-40 rounded-lg text-body-sm px-3 flex items-center font-[700] border"
                  style={{ background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)', color: 'var(--filter-tab-inactive-fg)' }}>
                  Search skills…
                </div>
                <div className="h-10 px-3.5 rounded-lg text-caption font-[700] flex items-center gap-1.5 border"
                  style={{ background: 'var(--filter-btn-active-bg)', color: 'var(--filter-btn-active-fg)', borderColor: 'var(--filter-btn-active-bg)' }}>
                  Filters
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="p-5 grid gap-4 sm:grid-cols-2" style={{ background: 'var(--sk-bg)' }}>
              <PromptCard prompt={samplePrompt} />
              <PromptCard
                prompt={{
                  ...samplePrompt,
                  id: 'sample-2',
                  slug: 'sample-2',
                  is_featured: false,
                  is_recommended: false,
                  title: 'Weekly revenue decomposition',
                  category: 'LTV',
                }}
              />
            </div>
          </div>
        </PageSection>

        {/* ══════════════════════════════════
            3. CLAUDE SKILLS
        ══════════════════════════════════ */}
        <PageSection id="claude" title="Claude Skills — editorial calm system">
          <p className="text-body-sm text-[var(--shell-muted-fg)] font-[600]">
            Darker Grotesque throughout (no Instrument Serif). Warm cream surfaces, thin borders, reading-first — calm and editorial. Not a dashboard.
            Tokens: <code className="font-mono text-[0.85em]">--cl-*</code>
          </p>

          {/* Type scale */}
          <div className="librarytokens-claude rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cl-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cl-surface)', borderColor: 'var(--cl-border)', color: 'var(--cl-text-muted)' }}>
              Typography — Darker Grotesque only
            </div>
            <div className="p-6" style={{ background: 'var(--cl-bg)' }}>
              <TypeScale fontFamily="'Darker Grotesque', system-ui, sans-serif" weights={[700, 600]} color="var(--cl-text)" />
            </div>
          </div>

          {/* Colour swatches */}
          <div className="librarytokens-claude rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cl-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cl-surface)', borderColor: 'var(--cl-border)', color: 'var(--cl-text-muted)' }}>
              Colour tokens
            </div>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" style={{ background: 'var(--cl-bg)' }}>
              <TokenSwatch label="--cl-header" value="#F3F1EC" bg="#f3f1ec" fg="#2a3630" border="#e4e1d9" />
              <TokenSwatch label="--cl-bg" value="#F4F2EC" bg="#f4f2ec" fg="#2a3630" border="#e4e1d9" />
              <TokenSwatch label="--cl-surface" value="#FFFDF9" bg="#fffdf9" fg="#2a3630" border="#e4e1d9" />
              <TokenSwatch label="--cl-accent" value="#5A7468" bg="#5a7468" fg="#fff" />
              <TokenSwatch label="--cl-text" value="#2A3630" bg="#2a3630" fg="#f4f2ec" />
              <TokenSwatch label="--cl-border" value="#E4E1D9" bg="#e4e1d9" fg="#2a3630" border="#c8c4bc" />
            </div>
          </div>

          {/* Filter + card preview */}
          <div className="librarytokens-claude rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cl-border)' }}>
            <div className="px-6 py-5 border-b text-caption font-[800] uppercase tracking-[0.06em]" style={{ background: 'var(--cl-surface)', borderColor: 'var(--cl-border)', color: 'var(--cl-text-muted)' }}>
              Component preview
            </div>

            {/* Header strip */}
            <div className="h-12 px-5 flex items-center justify-between border-b" style={{ background: 'var(--cl-header)', borderColor: 'var(--cl-border)' }}>
              <span className="text-caption font-[700]" style={{ color: 'var(--cl-text)' }}>Claude Skills header</span>
              <span className="h-7 px-3 rounded-full text-[11px] font-[700] border flex items-center" style={{ borderColor: 'var(--cl-border)', color: 'var(--cl-text-muted)' }}>Sign in</span>
            </div>

            {/* Filter bar preview */}
            <div style={{ background: 'var(--cl-surface)', borderBottom: `1px solid var(--cl-border-soft)` }}>
              <div className="flex items-stretch overflow-x-auto scrollbar-none border-b" style={{ borderColor: 'var(--cl-border-soft)' }}>
                {['All 12', 'Analytics 5', 'Conversion 4', 'Strategy 3'].map((tab, i) => (
                  <button
                    key={tab}
                    className="px-4 py-3.5 text-body-sm whitespace-nowrap border-b-2 border-transparent flex-shrink-0 flex items-center gap-[5px]"
                    style={i === 0 ? {
                      fontWeight: 700,
                      color: 'var(--cl-text)',
                      borderBottomColor: 'var(--cl-accent)',
                      background: 'var(--cl-tab-active-bg)',
                    } : {
                      fontWeight: 600,
                      color: 'var(--cl-text-muted)',
                    }}
                  >
                    {tab.split(' ')[0]}
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-[7px] text-[11px] font-[700]"
                      style={{ background: 'var(--cl-chip-count-bg)', color: 'var(--cl-chip-count-fg)' }}>
                      {tab.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-5 py-3">
                <div className="h-10 flex-1 min-w-40 rounded-lg text-body-sm px-3 flex items-center font-[600] border"
                  style={{ background: 'var(--cl-surface)', borderColor: 'var(--cl-border)', color: 'var(--cl-text-muted)' }}>
                  Search skills…
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="p-5 grid gap-4 sm:grid-cols-2" style={{ background: 'var(--cl-bg)' }}>
              <SkillCard skill={sampleSkill} />
              <SkillCard
                skill={{
                  ...sampleSkill,
                  id: 'skill-2',
                  slug: 'cro-checklist-skill',
                  title: 'CRO checklist skill',
                  category: 'Conversion',
                  is_featured: false,
                  is_recommended: true,
                }}
              />
            </div>
          </div>
        </PageSection>

        {/* ══════════════════════════════════
            4. SHARED
        ══════════════════════════════════ */}
        <PageSection id="shared" title="Shared — badges, meta-pills, utilities">
          <div className="surface-card p-6 space-y-5">
            <div>
              <p className="type-label mb-3">Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="featured">Featured</Badge>
                <Badge variant="recommended">Recommended</Badge>
                <Badge variant="needsFilling">Edit placeholders</Badge>
                <Badge variant="outline">Internal</Badge>
              </div>
            </div>
            <div>
              <p className="type-label mb-3">Category meta-pills</p>
              <div className="flex flex-wrap gap-2">
                <span className="meta-pill pill-CRO">CRO</span>
                <span className="meta-pill pill-LTV">LTV</span>
                <span className="meta-pill pill-BFCM">BFCM</span>
                <span className="meta-pill pill-Strategy">Strategy</span>
                <span className="meta-pill pill-Acquisition">Acquisition</span>
                <span className="meta-pill pill-SEO">SEO</span>
                <span className="meta-pill pill-Subscriptions">Subscriptions</span>
                <span className="meta-pill pill-Tech">Tech</span>
              </div>
            </div>
            <div>
              <p className="type-label mb-3">Prompt highlight marks</p>
              <p className="text-body-sm font-[600] text-[var(--shell-muted-fg)]">
                Use{' '}
                <em className="mark-tf">{'{{TF}}'}</em>
                {' '}for timeframe tokens and{' '}
                <em className="mark-cmp">{'{{CMP}}'}</em>
                {' '}for comparison period tokens within prompt body copy.
              </p>
            </div>
          </div>
        </PageSection>

        {/* ══════════════════════════════════
            5. SEMANTIC VARIABLE MAP
        ══════════════════════════════════ */}
        <PageSection id="tokens" title="Semantic variable map">
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-caption font-[600]">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--card-border)', background: 'var(--library-surface-muted)' }}>
                    {['Variable', 'Sidekick value', 'Claude Skills value', 'Purpose'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-label uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['--shell-bg', '--sk-bg', '--cl-bg', 'Page background'],
                    ['--shell-header-bg', '--sk-header', '--cl-header', 'Top nav background'],
                    ['--shell-fg', '--sk-text', '--cl-text', 'Primary text'],
                    ['--shell-muted-fg', '--sk-text-muted', '--cl-text-muted', 'Secondary / muted text'],
                    ['--shell-border', '--sk-border', '--cl-border', 'Dividers, nav border'],
                    ['--library-surface', '--sk-surface', '--cl-surface', 'Card / elevated surface'],
                    ['--library-accent', '--sk-accent', '--cl-accent', 'CTA, active states'],
                    ['--card-border', '--sk-border-strong', '--cl-border', 'Card border'],
                    ['--filter-bar-bg', '--sk-surface', '--cl-surface', 'Filter strip background'],
                    ['--filter-tab-active-fg', '--sk-text', '--cl-text', 'Active tab text'],
                    ['--filter-tab-active-border', '--sk-accent', '--cl-accent', 'Active tab underline'],
                    ['--filter-btn-active-bg', '--sk-text', '--cl-accent', 'Active filter button fill'],
                  ].map(([variable, sk, cl, purpose], i) => (
                    <tr
                      key={variable}
                      className="border-b"
                      style={{ borderColor: 'var(--card-border)', background: i % 2 === 0 ? 'var(--library-surface)' : 'var(--library-surface-muted)' }}
                    >
                      <td className="px-4 py-2.5 font-mono text-[12px] font-[700]" style={{ color: 'var(--shell-fg)' }}>{variable}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--sk-accent)' }}>{sk}</td>
                      <td className="px-4 py-2.5 font-mono text-[12px]" style={{ color: 'var(--cl-accent)' }}>{cl}</td>
                      <td className="px-4 py-2.5" style={{ color: 'var(--shell-muted-fg)' }}>{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageSection>

      </main>
    </TimeframeProvider>
  )
}
