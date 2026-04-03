'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PromptCard, PromptCardSkeleton } from './PromptCard'
import { FilterBar } from './FilterBar'
import { Header } from './Header'
import { TimeframeProvider } from './TimeframeContext'
import { CATEGORIES } from '@/types'
import type { Prompt } from '@/types'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptLibraryProps {
  isAdmin?: boolean
}

export function PromptLibrary({ isAdmin = false }: PromptLibraryProps) {
  return (
    <TimeframeProvider>
      <PromptLibraryInner isAdmin={isAdmin} />
    </TimeframeProvider>
  )
}

function PromptLibraryInner({ isAdmin }: { isAdmin: boolean }) {
  const searchParams = useSearchParams()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Filters from URL
  const category = searchParams.get('cat') ?? 'All'
  const query = searchParams.get('q') ?? ''
  const level = searchParams.get('level') ?? ''
  const useCasesRaw = searchParams.get('useCases') ?? ''
  const useCases = useCasesRaw ? useCasesRaw.split(',').filter(Boolean) : []
  const featured = searchParams.get('featured') === '1'
  const recommended = searchParams.get('recommended') === '1'

  // Fetch all prompts on mount
  useEffect(() => {
    async function load() {
      setLoading(true)
      let q = supabase
        .from('prompts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      const { data, error } = await q
      if (!error && data) {
        setPrompts(data as Prompt[])
      }
      setLoading(false)
    }
    load()
  }, [])

  // Client-side filtering
  const filtered = prompts.filter(p => {
    if (category !== 'All' && p.category !== category) return false
    if (level && p.level !== level) return false
    if (useCases.length > 0 && !useCases.some(uc => p.use_cases?.includes(uc))) return false
    if (featured && !p.is_featured) return false
    if (recommended && !p.is_recommended) return false

    if (query.trim()) {
      const q = query.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.prompt_body.toLowerCase().includes(q) ||
        p.when_to_use?.toLowerCase().includes(q) ||
        p.use_cases?.some(uc => uc.toLowerCase().includes(q)) ||
        p.data_sources?.some(ds => ds.toLowerCase().includes(q)) ||
        p.caveats?.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Category counts (based on all loaded prompts, not category/search)
  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    if (cat.value === 'All') return acc
    acc[cat.value] = prompts.filter(p => p.category === cat.value).length
    return acc
  }, {})

  return (
    <>
      {/* Sticky header height tracker */}
      <HdrHeightTracker />

      {/* Header */}
      <Header showTimeframe />

      {/* Filter bar */}
      <FilterBar totalCounts={categoryCounts} isAdmin={isAdmin} />

      {/* Main content */}
      <main className="max-w-[1500px] mx-auto px-5 py-6 pb-16">
        {/* Meta bar */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <span className="text-body-sm text-brand-gray font-[700]">
            Showing{' '}
            <strong className="text-dg">
              {loading ? '…' : filtered.length}
            </strong>{' '}
            prompt{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PromptCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(p => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full text-center py-16 px-5">
      <div className="text-4xl mb-3">🔍</div>
      <h3 className="font-serif text-h2 text-dg mb-2">No prompts found</h3>
      <p className="text-brand-gray text-body">
        {query
          ? `No results for "${query}". Try a different search term or clear your filters.`
          : 'Try adjusting your filters or clearing your search.'}
      </p>
    </div>
  )
}

// Tracks the header height for sticky filter bar positioning
function HdrHeightTracker() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hdr = document.getElementById('hdr')
    if (!hdr) return

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--hdr-h', `${hdr.offsetHeight}px`)
    })
    observer.observe(hdr)
    document.documentElement.style.setProperty('--hdr-h', `${hdr.offsetHeight}px`)

    return () => observer.disconnect()
  }, [])

  return null
}
