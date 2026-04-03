'use client'

import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { PromptCard } from '@/components/PromptCard'
import { SkillCard } from '@/components/SkillCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Prompt, Skill } from '@/types'

const samplePrompt: Prompt = {
  id: 'sample-1',
  slug: 'sample-prompt',
  title: 'Category performance pulse check',
  short_description: 'A quick prompt to identify category movement, conversion shifts, and where to investigate further.',
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

const colorTokens = [
  ['Dark Green', 'bg-dg text-white'],
  ['Forest Green', 'bg-fg text-white'],
  ['Light Green', 'bg-lg text-dg'],
  ['Cream', 'bg-cream text-brand-black border border-brand-border'],
  ['Brand Black', 'bg-brand-black text-white'],
  ['Brand Gray', 'bg-brand-gray text-white'],
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-6 space-y-4">
      <h2 className="type-h3">{title}</h2>
      {children}
    </section>
  )
}

export default function DesignSystemPage() {
  return (
    <TimeframeProvider>
      <Header showTimeframe={false} />
      <main className="max-w-6xl mx-auto px-5 py-8 space-y-10">
        <header className="space-y-3">
          <h1 className="type-h1">Design system</h1>
          <p className="type-body-sm max-w-3xl">
            Three style systems share one app. Routes set <code className="font-mono text-[0.8em]">data-library=&quot;sidekick&quot; | &quot;claude&quot;</code> on{' '}
            <code className="font-mono text-[0.8em]">&lt;html&gt;</code>, which maps semantic variables from the{' '}
            <code className="font-mono text-[0.8em]">--sk-*</code> and <code className="font-mono text-[0.8em]">--cl-*</code> namespaces in{' '}
            <code className="font-mono text-[0.8em]">app/globals.css</code>. The site footer is always{' '}
            <code className="font-mono text-[0.8em]">data-style-system=&quot;convert&quot;</code> and uses <code className="font-mono text-[0.8em]">--cv-*</code> only, so library
            changes never leak into Convert typography.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="type-h2">Convert</h2>
          <p className="type-body-sm max-w-3xl">
            Instrument Serif + Darker Grotesque on cream; brand greens for emphasis. Tokens: <code className="font-mono text-[0.8em]">--cv-*</code> in{' '}
            <code className="font-mono text-[0.8em]">:root</code>. Preview below wraps editorial blocks and a slim footer band.
          </p>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--cv-border)' }}>
            <div className="p-6 space-y-4" style={{ background: 'var(--cv-cream)' }}>
              <h3 className="font-serif text-h2" style={{ color: 'var(--cv-dg)' }}>
                Editorial heading
              </h3>
              <p className="font-sans text-body-sm" style={{ color: 'var(--cv-text)', fontWeight: 600 }}>
                Sans body copy for Convert marketing rhythm and footer descriptions.
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="rounded-full px-3 py-1 text-caption font-[800]" style={{ background: 'var(--cv-lg)', color: 'var(--cv-dg)' }}>
                  Accent pill
                </span>
                <button
                  type="button"
                  className="h-9 rounded-full px-4 text-caption font-[700] border transition-colors"
                  style={{
                    borderColor: 'var(--cv-border)',
                    color: 'var(--cv-dg)',
                    background: 'var(--cv-elevated)',
                  }}
                >
                  Outline control
                </button>
              </div>
            </div>
            <footer data-style-system="convert" className="convert-footer mt-0">
              <div className="px-6 py-5 max-w-none">
                <p className="convert-footer__title">Built by Convert Digital</p>
                <p className="convert-footer__body mt-1">Footer sample using only Convert tokens.</p>
              </div>
            </footer>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="type-h2">Sidekick</h2>
          <p className="type-body-sm max-w-3xl">
            High-contrast utility UI (Inter body on library routes), stronger filter tabs and input borders. Namespace: <code className="font-mono text-[0.8em]">--sk-*</code>; semantic
            shell/filter variables mirror the active library in <code className="font-mono text-[0.8em]">globals.css</code>.
          </p>
          <div
            className="librarytokens-sidekick rounded-xl border p-5 space-y-4"
            style={{ borderColor: 'var(--sk-border)', background: 'var(--sk-bg)' }}
          >
            <div className="h-11 rounded-lg flex items-center justify-center text-caption font-[800]" style={{ background: 'var(--sk-header)', color: '#fff' }}>
              Header strip (dark green)
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3 shadow-card-soft" style={{ borderColor: 'var(--card-border)', background: 'var(--library-surface)' }}>
                <p className="type-label mb-2" style={{ color: 'var(--filter-tab-inactive-fg)' }}>
                  Filter surface
                </p>
                <div className="flex gap-1">
                  <span className="h-8 px-3 rounded-md text-caption font-[800] border-b-2" style={{ background: 'var(--filter-tab-active-bg)', borderColor: 'var(--filter-tab-active-border)', color: 'var(--filter-tab-active-fg)' }}>
                    Active tab
                  </span>
                  <span className="h-8 px-3 rounded-md text-caption font-[700] flex items-center" style={{ color: 'var(--filter-tab-inactive-fg)' }}>
                    Other
                  </span>
                </div>
              </div>
              <div className="rounded-lg border p-3 flex flex-col gap-2" style={{ borderColor: 'var(--card-border)', background: 'var(--library-surface-muted)' }}>
                <span className="text-caption font-sidekick font-[600]" style={{ color: 'var(--sk-text)' }}>
                  Inter / utility scale (font-sidekick)
                </span>
                <div className="h-9 rounded-md text-caption font-[700] px-3 flex items-center border" style={{ borderColor: 'var(--filter-input-border)', background: 'var(--filter-bar-bg)' }}>
                  Search field preview
                </div>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <PromptCard prompt={samplePrompt} />
              <PromptCard
                prompt={{
                  ...samplePrompt,
                  id: 'sample-2',
                  slug: 'sample-2',
                  is_featured: false,
                  is_recommended: false,
                  source_label: 'Shopify',
                  title: 'Weekly revenue decomposition',
                  category: 'LTV',
                }}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="type-h2">Claude Skills</h2>
          <p className="type-body-sm max-w-3xl">
            Warm cream surfaces, thin borders, softer chips, serif-friendly headings on cards. Namespace: <code className="font-mono text-[0.8em]">--cl-*</code>; applied when{' '}
            <code className="font-mono text-[0.8em]">/skills</code> routes set the library to Claude.
          </p>
          <div
            className="librarytokens-claude rounded-xl border p-5 space-y-4"
            style={{ borderColor: 'var(--cl-border)', background: 'var(--cl-bg)' }}
          >
            <div className="h-11 rounded-lg flex items-center justify-center text-caption font-[800]" style={{ background: 'var(--cl-header)', color: 'var(--cl-text)' }}>
              Skills header strip (warm)
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
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
        </section>

        <Section title="Shared Tailwind brand colours">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colorTokens.map(([name, styles]) => (
              <div key={name} className={`rounded-lg p-4 text-body-sm font-[700] ${styles}`}>
                {name}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Namespace swatches (CSS)">
          <div className="grid gap-4 md:grid-cols-3 text-caption font-[700]">
            <div className="space-y-2 rounded-lg border border-brand-border p-3">
              <p className="type-label">--sk-*</p>
              <div className="h-10 rounded-md" style={{ background: 'var(--sk-header)' }} />
              <div className="h-10 rounded-md border" style={{ background: 'var(--sk-tab-active-bg)', borderColor: 'var(--sk-border)' }} />
            </div>
            <div className="space-y-2 rounded-lg border border-brand-border p-3">
              <p className="type-label">--cl-*</p>
              <div className="h-10 rounded-md border" style={{ background: 'var(--cl-header)', borderColor: 'var(--cl-border)' }} />
              <div className="h-10 rounded-md border" style={{ background: 'var(--cl-surface-muted)', borderColor: 'var(--cl-border)' }} />
            </div>
            <div className="space-y-2 rounded-lg border border-brand-border p-3">
              <p className="type-label">--cv-*</p>
              <div className="h-10 rounded-md border" style={{ background: 'var(--cv-cream)', borderColor: 'var(--cv-border)' }} />
              <div className="h-10 rounded-md" style={{ background: 'var(--cv-fg)' }} />
            </div>
          </div>
        </Section>

        <Section title="Shared components (shadcn / primitives)">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 pt-4">
            <div className="space-y-3">
              <Input placeholder="Search prompts..." />
              <Textarea placeholder="Prompt notes..." />
            </div>
            <div className="space-y-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">Option one</SelectItem>
                  <SelectItem value="two">Option two</SelectItem>
                </SelectContent>
              </Select>
              <label className="inline-flex items-center gap-2 text-body-sm text-brand-text">
                <Checkbox />
                Include featured prompts only
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-4">
            <Badge variant="featured">Featured</Badge>
            <Badge variant="recommended">Recommended</Badge>
            <Badge variant="needsFilling">Edit placeholders</Badge>
            <Badge variant="outline">Internal</Badge>
            <span className="meta-pill pill-CRO">CRO</span>
            <span className="meta-pill pill-Strategy">Strategy</span>
          </div>
        </Section>

        <Section title="Filter control pattern (reference)">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">All</Button>
              <Button size="sm" variant="outline">
                CRO
              </Button>
              <Button size="sm" variant="outline">
                LTV
              </Button>
              <Button size="sm" variant="outline">
                Strategy
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <Input placeholder="Search prompts..." />
              <Select>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Level: any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">More filters</Button>
            </div>
          </div>
        </Section>

        <Section title="Spacing, radius, shadows">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-brand-border p-4">Radius md / border</div>
            <div className="rounded-lg border border-brand-border p-4 shadow-card-soft">Soft card shadow</div>
            <div className="rounded-xl border border-brand-border p-4 shadow-card-hover">Hover card shadow</div>
          </div>
        </Section>
      </main>
    </TimeframeProvider>
  )
}
