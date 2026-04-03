'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn, buildPrompt, hasManualPlaceholders } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CopyButton } from './CopyButton'
import { useTimeframe } from './TimeframeContext'
import { CATEGORIES } from '@/types'
import type { Prompt } from '@/types'

interface PromptCardProps {
  prompt: Prompt
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { state } = useTimeframe()

  const builtPrompt = buildPrompt(prompt.prompt_body, state)
  const catConfig = CATEGORIES.find(c => c.value === prompt.category)
  const needsFilling = hasManualPlaceholders(prompt.prompt_body)

  return (
    <div className={cn(
      'surface-card overflow-hidden flex flex-col',
      'transition-all duration-200',
      'hover:border-fg hover:shadow-card-hover'
    )}>
      {/* Card header */}
      <div className="px-5 py-4 border-b border-brand-border">
        <div className="flex items-center justify-between mb-3 gap-1.5">
          {/* Category pill */}
          {catConfig && catConfig.value !== 'All' && (
            <span className={cn(
              'text-label font-[800] tracking-[0.08em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap',
              catConfig.pillClass
            )}>
              {prompt.category}
            </span>
          )}

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            {prompt.is_featured && (
              <Badge variant="featured">Featured</Badge>
            )}
            {prompt.is_recommended && (
              <Badge variant="recommended">Recommended</Badge>
            )}
            {needsFilling && (
              <Badge variant="needsFilling">Edit placeholders</Badge>
            )}
          </div>
        </div>

        <Link
          href={`/prompts/${prompt.slug}`}
          className="block group"
        >
          <h3 className="font-serif text-h3 text-brand-black leading-[1.18] mb-1.5 group-hover:text-fg transition-colors">
            {prompt.title}
          </h3>
        </Link>
        <p className="text-body-sm text-brand-gray font-[600] leading-[1.45]">
          {prompt.short_description}
        </p>
      </div>

      {/* Prompt body preview */}
      <div className="flex-1 px-5 py-4 relative bg-cream/28">
        <div className="text-label text-brand-gray mb-2">Prompt preview</div>
        <div className="relative">
          <div className={cn(
            'prompt-body text-body-sm leading-[1.72] text-brand-text whitespace-pre-wrap font-sans font-[600] transition-all duration-300',
            expanded ? 'max-h-none' : 'max-h-[148px] overflow-hidden'
          )}>
            {builtPrompt}
          </div>
          {!expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-brand-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-caption font-[700] text-brand-gray hover:text-dg transition-colors flex items-center gap-1"
          >
            {expanded ? (
              <><ChevronUp size={13} /> Show less</>
            ) : (
              <><ChevronDown size={13} /> Show more</>
            )}
          </button>
          <Link
            href={`/prompts/${prompt.slug}`}
            className="text-caption font-[700] text-brand-gray hover:text-dg transition-colors flex items-center gap-1"
          >
            <ExternalLink size={11} />
            Details
          </Link>
        </div>
        <CopyButton prompt={prompt} />
      </div>
    </div>
  )
}

// Skeleton version
export function PromptCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-5 w-14 rounded-full bg-brand-border/60 animate-pulse" />
          <div className="ml-auto h-4 w-16 bg-brand-border/60 animate-pulse rounded" />
        </div>
        <div className="h-5 w-4/5 bg-brand-border/60 animate-pulse rounded" />
        <div className="h-4 w-3/4 bg-brand-border/60 animate-pulse rounded" />
      </div>
      <div className="px-5 py-4 space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-3 bg-brand-border/60 animate-pulse rounded" style={{ width: `${70 + i * 5}%` }} />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-brand-border flex justify-between">
        <div className="h-5 w-20 bg-brand-border/60 animate-pulse rounded" />
        <div className="h-8 w-20 bg-brand-border/60 animate-pulse rounded-lg" />
      </div>
    </div>
  )
}
