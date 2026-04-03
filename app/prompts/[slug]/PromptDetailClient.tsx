'use client'

import Link from 'next/link'
import { ArrowLeft, Share2, Calendar, User, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { CopyButtonFull } from '@/components/CopyButton'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, USE_CASE_LABELS } from '@/types'
import { cn, buildPrompt, formatDate, hasManualPlaceholders } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useTimeframe } from '@/components/TimeframeContext'
import type { Prompt } from '@/types'

interface PromptDetailClientProps {
  prompt: Prompt
  followUpPrompts: Pick<Prompt, 'id' | 'slug' | 'title' | 'short_description' | 'category'>[]
}

export function PromptDetailClient({ prompt, followUpPrompts }: PromptDetailClientProps) {
  return (
    <TimeframeProvider>
      <Header showTimeframe />
      <PromptDetailInner prompt={prompt} followUpPrompts={followUpPrompts} />
    </TimeframeProvider>
  )
}

function PromptDetailInner({ prompt, followUpPrompts }: PromptDetailClientProps) {
  const { state } = useTimeframe()
  const builtPrompt = buildPrompt(prompt.prompt_body, state)
  const catConfig = CATEGORIES.find(c => c.value === prompt.category)
  const needsFilling = hasManualPlaceholders(prompt.prompt_body)

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard')
      trackEvent('prompt_share', {
        promptId: prompt.id,
        promptSlug: prompt.slug,
        category: prompt.category,
      })
    })
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-6 pb-16">
      {/* Back nav */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-[700] text-brand-gray hover:text-dg transition-colors"
        >
          <ArrowLeft size={13} />
          Back to library
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {catConfig && catConfig.value !== 'All' && (
            <span className={cn(
              'text-[9.5px] font-[800] tracking-[0.08em] uppercase px-2 py-[3px] rounded-full',
              catConfig.pillClass
            )}>
              {prompt.category}
            </span>
          )}
          {prompt.is_featured && <Badge variant="featured">Featured</Badge>}
          {prompt.is_recommended && <Badge variant="recommended">Recommended</Badge>}
          {needsFilling && <Badge variant="needsFilling">Edit placeholders</Badge>}
          {prompt.source_label && (
            <span className={cn(
              'text-[9.5px] font-[700] tracking-[0.05em] uppercase',
              prompt.source_label === 'Shopify' ? 'text-fg' : 'text-brand-gray'
            )}>
              {prompt.source_label}
            </span>
          )}
          {prompt.level && (
            <span className="text-[9.5px] font-[700] tracking-[0.05em] uppercase text-brand-gray">
              {prompt.level}
            </span>
          )}
        </div>

        <h1 className="font-serif text-[28px] leading-tight text-brand-black mb-2">
          {prompt.title}
        </h1>
        {prompt.short_description && (
          <p className="text-[15px] text-brand-gray font-[500] leading-relaxed">
            {prompt.short_description}
          </p>
        )}
      </div>

      {/* When to use */}
      {prompt.when_to_use && (
        <div className="mb-6 bg-lg/10 border border-lg/30 rounded-xl p-4">
          <h2 className="text-[10px] font-[800] uppercase tracking-[0.12em] text-dg opacity-70 mb-2">
            When this prompt is useful
          </h2>
          <p className="text-[13.5px] text-brand-text font-[500] leading-relaxed">
            {prompt.when_to_use}
          </p>
        </div>
      )}

      {/* Metadata chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {prompt.use_cases?.map(uc => (
          <span
            key={uc}
            className="text-[11px] font-[700] px-2.5 py-1 bg-cream border border-brand-border rounded-full text-brand-gray"
          >
            {USE_CASE_LABELS[uc] ?? uc}
          </span>
        ))}
        {prompt.data_sources?.map(ds => (
          <span
            key={ds}
            className="text-[11px] font-[700] px-2.5 py-1 bg-dg/5 border border-dg/10 rounded-full text-dg"
          >
            {ds}
          </span>
        ))}
      </div>

      {/* Prompt body */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[10px] font-[800] uppercase tracking-[0.12em] text-brand-gray">
            Prompt
          </h2>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-[700] text-brand-gray hover:text-dg transition-colors"
          >
            <Share2 size={12} />
            Share
          </button>
        </div>
        <div className="bg-white border border-brand-border rounded-xl p-5">
          <pre className="prompt-body text-[13px] leading-[1.72] text-brand-text whitespace-pre-wrap font-sans font-[500]">
            {builtPrompt}
          </pre>
        </div>
      </div>

      {/* Copy button */}
      <div className="mb-8">
        <CopyButtonFull prompt={prompt} />
      </div>

      {/* Caveats */}
      {prompt.caveats && (
        <div className="mb-6 border border-brand-border rounded-xl p-4">
          <h2 className="text-[10px] font-[800] uppercase tracking-[0.12em] text-brand-gray mb-2">
            Caveats &amp; notes
          </h2>
          <p className="text-[13px] text-brand-text font-[500] leading-relaxed whitespace-pre-wrap">
            {prompt.caveats}
          </p>
        </div>
      )}

      {/* Follow-up prompts */}
      {followUpPrompts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[10px] font-[800] uppercase tracking-[0.12em] text-brand-gray mb-3">
            Follow-up prompts
          </h2>
          <div className="space-y-2">
            {followUpPrompts.map(p => {
              const cat = CATEGORIES.find(c => c.value === p.category)
              return (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="block bg-white border border-brand-border rounded-xl p-3.5 hover:border-fg hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {cat && cat.value !== 'All' && (
                      <span className={cn('text-[9px] font-[800] tracking-[0.08em] uppercase px-1.5 py-[2px] rounded-full', cat.pillClass)}>
                        {p.category}
                      </span>
                    )}
                  </div>
                  <div className="font-serif text-[15px] group-hover:text-fg transition-colors">{p.title}</div>
                  {p.short_description && (
                    <div className="text-[12px] text-brand-gray mt-0.5">{p.short_description}</div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Meta footer */}
      <div className="border-t border-brand-border pt-4 flex flex-wrap gap-4 text-[11.5px] text-brand-gray font-[500]">
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
        {prompt.version > 1 && (
          <div className="flex items-center gap-1.5">
            <Tag size={12} />
            v{prompt.version}
          </div>
        )}
      </div>
    </main>
  )
}
