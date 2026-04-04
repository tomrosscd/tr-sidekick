'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Share2, Calendar, User, Tag, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { CopyButtonFull } from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, USE_CASE_LABELS } from '@/types'
import { cn, buildPrompt, formatDate, hasManualPlaceholders } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useTimeframe } from '@/components/TimeframeContext'
import type { Prompt, PromptVersion } from '@/types'

interface PromptDetailClientProps {
  prompt: Prompt
  versions: PromptVersion[]
  followUpPrompts: Pick<Prompt, 'id' | 'slug' | 'title' | 'short_description' | 'category'>[]
}

export function PromptDetailClient({ prompt, versions, followUpPrompts }: PromptDetailClientProps) {
  return (
    <TimeframeProvider>
      <Header showTimeframe />
      <PromptDetailInner prompt={prompt} versions={versions} followUpPrompts={followUpPrompts} />
    </TimeframeProvider>
  )
}

function PromptDetailInner({ prompt, versions, followUpPrompts }: PromptDetailClientProps) {
  const { state } = useTimeframe()

  // Find the current (latest) version — first item since sorted DESC, or fall back to null
  const currentVersion = versions.find(v => v.id === prompt.current_version_id) ?? versions[0] ?? null

  // Which version is selected for display; null = use prompt.prompt_body directly
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(currentVersion)

  // The body to actually render — selected version or the raw prompt body
  const activeBody = selectedVersion?.prompt_body ?? prompt.prompt_body
  const builtPrompt = buildPrompt(activeBody, state)

  const isCurrentVersion = !selectedVersion || selectedVersion.id === currentVersion?.id

  const catConfig = CATEGORIES.find(c => c.value === prompt.category)
  const needsFilling = hasManualPlaceholders(activeBody)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied to clipboard')
      trackEvent('prompt_share', {
        promptId: prompt.id,
        promptSlug: prompt.slug,
        category: prompt.category,
      })
    })
  }

  const hasVersions = versions.length > 1

  return (
    <main className="max-w-4xl mx-auto px-5 py-8 pb-20">

      {/* ── Back nav ── */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-sm font-[700] text-brand-gray hover:text-dg transition-colors"
        >
          <ArrowLeft size={13} />
          Back to library
        </Link>
      </div>

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {catConfig && catConfig.value !== 'All' && (
            <span className={cn('meta-pill', catConfig.pillClass)}>
              {prompt.category}
            </span>
          )}
          {prompt.is_featured && <Badge variant="featured">Featured</Badge>}
          {prompt.is_recommended && <Badge variant="recommended">Recommended</Badge>}
          {needsFilling && <Badge variant="needsFilling">Edit placeholders</Badge>}
          {prompt.source_label && (
            <span className={cn(
              'text-label font-[700] tracking-[0.06em] uppercase',
              prompt.source_label === 'Shopify' ? 'text-fg' : 'text-brand-gray'
            )}>
              {prompt.source_label}
            </span>
          )}
          {prompt.level && (
            <span className="text-label font-[700] tracking-[0.06em] uppercase text-brand-gray">
              {prompt.level}
            </span>
          )}
        </div>

        <h1 className="font-serif text-h1 leading-[1.08] text-brand-black mb-3">
          {prompt.title}
        </h1>
        {prompt.short_description && (
          <p className="text-body text-brand-gray font-[600] leading-relaxed max-w-3xl">
            {prompt.short_description}
          </p>
        )}
      </div>

      {/* ── When to use ── */}
      {prompt.when_to_use && (
        <div className="mb-8 bg-lg/10 border border-lg/30 rounded-xl p-5">
          <h2 className="type-label text-dg/80 mb-2">When this prompt is useful</h2>
          <p className="text-body-sm text-brand-text font-[600] leading-relaxed">
            {prompt.when_to_use}
          </p>
        </div>
      )}

      {/* ── Metadata chips ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {prompt.use_cases?.map(uc => (
          <span key={uc} className="text-caption font-[700] px-3 py-1.5 bg-cream border border-brand-border rounded-full text-brand-gray">
            {USE_CASE_LABELS[uc] ?? uc}
          </span>
        ))}
        {prompt.data_sources?.map(ds => (
          <span key={ds} className="text-caption font-[700] px-3 py-1.5 bg-dg/5 border border-dg/10 rounded-full text-dg">
            {ds}
          </span>
        ))}
      </div>

      {/* ── Prompt body ── */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h2 className="type-label">Prompt</h2>

            {/* Version selector — only shown when multiple versions exist */}
            {hasVersions && (
              <div className="flex items-center gap-1 flex-wrap">
                {versions.map(v => {
                  const isCurrent = v.id === currentVersion?.id
                  const isSelected = selectedVersion?.id === v.id
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v)}
                      className={cn(
                        'h-6 px-2.5 rounded-full text-[11px] font-[800] tracking-[0.04em] transition-colors border',
                        isSelected
                          ? 'bg-dg text-white border-dg'
                          : 'bg-cream border-brand-border text-brand-gray hover:border-dg hover:text-dg'
                      )}
                    >
                      v{v.version_number}
                      {isCurrent && <span className="ml-1 opacity-60">·&nbsp;current</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-caption font-[700] text-brand-gray hover:text-dg transition-colors"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>

        {/* Viewing old version banner */}
        {!isCurrentVersion && (
          <div className="mb-3 flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-brand-yellow/40 border border-brand-yellow text-caption font-[700] text-brand-black">
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              Viewing v{selectedVersion?.version_number}
              {selectedVersion?.change_notes ? ` — ${selectedVersion.change_notes}` : ''}
            </div>
            <button
              onClick={() => setSelectedVersion(currentVersion)}
              className="underline underline-offset-2 hover:no-underline"
            >
              Switch to current
            </button>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-card-soft">
          <pre className="prompt-body text-body leading-[1.72] text-brand-text whitespace-pre-wrap font-sans font-[600]">
            {builtPrompt}
          </pre>
        </div>
      </div>

      {/* ── Copy button ── */}
      <div className="mb-10">
        <CopyButtonFull prompt={{ ...prompt, prompt_body: activeBody }} />
      </div>

      {/* ── Version history ── */}
      {hasVersions && (
        <VersionHistory
          versions={versions}
          currentVersionId={currentVersion?.id ?? null}
          selectedVersionId={selectedVersion?.id ?? null}
          onSelect={setSelectedVersion}
        />
      )}

      {/* ── Caveats ── */}
      {prompt.caveats && (
        <div className="mb-8 border border-brand-border rounded-xl p-5 bg-white">
          <h2 className="type-label mb-2">Caveats &amp; notes</h2>
          <p className="text-body-sm text-brand-text font-[600] leading-relaxed whitespace-pre-wrap">
            {prompt.caveats}
          </p>
        </div>
      )}

      {/* ── Follow-up prompts ── */}
      {followUpPrompts.length > 0 && (
        <div className="mb-8">
          <h2 className="type-label mb-3">Follow-up prompts</h2>
          <div className="space-y-2">
            {followUpPrompts.map(p => {
              const cat = CATEGORIES.find(c => c.value === p.category)
              return (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="block bg-white border border-brand-border rounded-xl p-4 hover:border-fg hover:shadow-card-soft transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {cat && cat.value !== 'All' && (
                      <span className={cn('meta-pill', cat.pillClass)}>{p.category}</span>
                    )}
                  </div>
                  <div className="font-serif text-h3 leading-[1.2] group-hover:text-fg transition-colors">{p.title}</div>
                  {p.short_description && (
                    <div className="text-caption text-brand-gray mt-1">{p.short_description}</div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Meta footer ── */}
      <div className="border-t border-brand-border pt-5 flex flex-wrap gap-5 text-caption text-brand-gray font-[600]">
        {prompt.owner_name && (
          <div className="flex items-center gap-1.5">
            <User size={12} />
            {prompt.owner_name}
          </div>
        )}
        {prompt.last_reviewed_at && (
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            Last reviewed {formatDate(prompt.last_reviewed_at)}
          </div>
        )}
        {(currentVersion?.version_number ?? prompt.version) > 1 && (
          <div className="flex items-center gap-1.5">
            <Tag size={12} />
            v{currentVersion?.version_number ?? prompt.version}
          </div>
        )}
      </div>
    </main>
  )
}

// ── Version history component ────────────────────────────────────────────────

interface VersionHistoryProps {
  versions: PromptVersion[]
  currentVersionId: string | null
  selectedVersionId: string | null
  onSelect: (v: PromptVersion) => void
}

function VersionHistory({ versions, currentVersionId, selectedVersionId, onSelect }: VersionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="mb-8">
      <h2 className="type-label mb-3">Version history</h2>

      <div className="border border-brand-border rounded-xl overflow-hidden bg-white">
        {versions.map((v, i) => {
          const isCurrent = v.id === currentVersionId
          const isSelected = v.id === selectedVersionId
          const isExpanded = expandedId === v.id
          const isLast = i === versions.length - 1

          return (
            <div
              key={v.id}
              className={cn(
                'transition-colors',
                !isLast && 'border-b border-brand-border',
                isSelected && 'bg-lg/10'
              )}
            >
              {/* Version row */}
              <div className="flex items-start gap-3 px-5 py-4">

                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className={cn(
                    'w-2.5 h-2.5 rounded-full border-2 mt-0.5',
                    isCurrent
                      ? 'bg-dg border-dg'
                      : 'bg-white border-brand-border'
                  )} />
                  {!isLast && (
                    <div className="w-px flex-1 mt-1.5" style={{ background: 'var(--brand-border)', minHeight: '100%' }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-body-sm font-[800] text-brand-black">
                      v{v.version_number}
                    </span>
                    {isCurrent && (
                      <span className="h-5 px-2 rounded-full text-[10px] font-[900] uppercase tracking-[0.06em] bg-dg text-white">
                        Current
                      </span>
                    )}
                    {v.change_notes && (
                      <span className="text-body-sm font-[600] text-brand-gray truncate">
                        {v.change_notes}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-caption font-[600] text-brand-gray">
                    {v.created_by_name && (
                      <span className="inline-flex items-center gap-1">
                        <User size={11} />
                        {v.created_by_name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      {formatDate(v.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isSelected && (
                    <button
                      onClick={() => onSelect(v)}
                      className="h-7 px-3 rounded-full text-[11px] font-[700] border border-brand-border text-brand-gray hover:border-dg hover:text-dg transition-colors"
                    >
                      View
                    </button>
                  )}
                  {isSelected && (
                    <span className="h-7 px-3 rounded-full text-[11px] font-[800] bg-dg/8 border border-dg/20 text-dg flex items-center">
                      Viewing
                    </span>
                  )}
                  <button
                    onClick={() => toggleExpand(v.id)}
                    className="h-7 w-7 rounded-full flex items-center justify-center border border-brand-border text-brand-gray hover:border-dg hover:text-dg transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand content'}
                  >
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-4 pl-11">
                  <div className="rounded-lg border border-brand-border bg-cream p-4">
                    <p className="text-caption font-[800] uppercase tracking-[0.06em] text-brand-gray mb-2">
                      Prompt content at this version
                    </p>
                    <pre className="text-body-sm font-[600] text-brand-text whitespace-pre-wrap leading-[1.65] font-sans">
                      {v.prompt_body}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
