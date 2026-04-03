'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div
      className={cn(
        'surface-card overflow-hidden flex flex-col transition-all duration-200',
        'hover:border-fg hover:shadow-card-hover'
      )}
    >
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <span className="meta-pill" style={{ background: 'var(--library-chip-bg)', color: 'var(--library-chip-fg)' }}>{skill.category}</span>
          {skill.is_featured && <Badge variant="featured">Featured</Badge>}
          {skill.is_recommended && <Badge variant="recommended">Recommended</Badge>}
        </div>
        <Link href={`/skills/${skill.slug}`} className="block group">
          <h3 className="font-serif text-h3 text-[var(--shell-fg)] leading-[1.22] mb-1.5 group-hover:text-[var(--library-accent)] transition-colors">
            {skill.title}
          </h3>
        </Link>
        {skill.short_description && (
          <p className="text-body-sm text-[var(--shell-muted-fg)] font-[500] leading-[1.5]">
            {skill.short_description}
          </p>
        )}
      </div>

      <div className="px-5 py-4 border-b" style={{ background: 'var(--library-surface-muted)', borderColor: 'var(--card-border)' }}>
        <div className="type-label mb-2">Use cases</div>
        <div className="flex flex-wrap gap-1.5">
          {skill.use_cases.slice(0, 4).map(useCase => (
            <span
              key={useCase}
              className="text-caption font-[600] px-2.5 py-1.5 rounded-full border bg-[var(--library-surface)] text-[var(--shell-muted-fg)]"
              style={{ borderColor: 'var(--card-border)' }}
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--card-border)' }}>
        <span className="text-caption text-[var(--shell-muted-fg)] font-[600]">
          {skill.owner_name ?? 'Unassigned owner'}
        </span>
        <Link
          href={`/skills/${skill.slug}`}
          className="text-caption font-[600] text-[var(--library-accent)] hover:underline"
        >
          Details
        </Link>
      </div>
    </div>
  )
}

export function SkillCardSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border space-y-2.5">
        <div className="h-5 w-16 rounded-full bg-brand-border/60 animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-brand-border/60 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-brand-border/60 animate-pulse" />
      </div>
      <div className="px-5 py-4 border-b border-brand-border space-y-2">
        <div className="h-4 w-20 rounded bg-brand-border/60 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-brand-border/60 animate-pulse" />
          <div className="h-6 w-24 rounded-full bg-brand-border/60 animate-pulse" />
        </div>
      </div>
      <div className="px-5 py-3 flex justify-between">
        <div className="h-4 w-28 rounded bg-brand-border/60 animate-pulse" />
        <div className="h-4 w-12 rounded bg-brand-border/60 animate-pulse" />
      </div>
    </div>
  )
}
