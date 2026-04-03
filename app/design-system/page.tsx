'use client'

import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { PromptCard } from '@/components/PromptCard'
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
import type { Prompt } from '@/types'

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
      <main className="max-w-6xl mx-auto px-5 py-8 space-y-6">
        <section className="space-y-2">
          <h1 className="type-h1">Design system</h1>
          <p className="type-body-sm max-w-3xl">
            Internal visual reference for typography, tokens, controls, and card styling used across the app.
          </p>
        </section>

        <Section title="Typography">
          <div className="space-y-3">
            <p className="type-display">Display text sample</p>
            <p className="type-h1">Heading 1 sample</p>
            <p className="type-h2">Heading 2 sample</p>
            <p className="type-h3">Heading 3 sample</p>
            <p className="type-body">Body text is used for primary reading content and key descriptive text.</p>
            <p className="type-body-sm">Body small is used for compact descriptions and secondary content.</p>
            <p className="type-caption">Caption text is used for metadata, helper copy, and supporting labels.</p>
            <p className="type-label">Label / overline token</p>
          </div>
        </Section>

        <Section title="Colour tokens">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colorTokens.map(([name, styles]) => (
              <div key={name} className={`rounded-lg p-4 text-body-sm font-[700] ${styles}`}>
                {name}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </Section>

        <Section title="Inputs, textarea, select, checkbox">
          <div className="grid gap-4 md:grid-cols-2">
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
        </Section>

        <Section title="Badges and pills">
          <div className="flex flex-wrap gap-2">
            <Badge variant="featured">Featured</Badge>
            <Badge variant="recommended">Recommended</Badge>
            <Badge variant="needsFilling">Edit placeholders</Badge>
            <Badge variant="outline">Internal</Badge>
            <span className="pill-CRO text-label px-2.5 py-1 rounded-full">CRO</span>
            <span className="pill-Strategy text-label px-2.5 py-1 rounded-full">Strategy</span>
          </div>
        </Section>

        <Section title="Filter controls">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">All</Button>
              <Button size="sm" variant="outline">CRO</Button>
              <Button size="sm" variant="outline">LTV</Button>
              <Button size="sm" variant="outline">Strategy</Button>
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

        <Section title="Prompt card states">
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
