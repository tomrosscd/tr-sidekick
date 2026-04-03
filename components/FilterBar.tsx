'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X, SlidersHorizontal, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { CATEGORIES, USE_CASE_OPTIONS, USE_CASE_LABELS } from '@/types'

interface FilterBarProps {
  totalCounts: Record<string, number>
  isAdmin?: boolean
}

export function FilterBar({ totalCounts, isAdmin = false }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Read state from URL
  const category = searchParams.get('cat') ?? 'All'
  const search = searchParams.get('q') ?? ''
  const level = searchParams.get('level') ?? ''
  const useCases = searchParams.get('useCases')?.split(',').filter(Boolean) ?? []
  const featured = searchParams.get('featured') === '1'
  const recommended = searchParams.get('recommended') === '1'

  const [localSearch, setLocalSearch] = useState(search)
  const [showFilters, setShowFilters] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // Sync localSearch to URL with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (localSearch !== search) {
        updateParam('q', localSearch || null)
        if (localSearch) {
          trackEvent('search_used', { searchTerm: localSearch })
        }
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [localSearch])

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const clearAll = () => {
    setLocalSearch('')
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }

  const hasActiveFilters =
    category !== 'All' ||
    search !== '' ||
    level !== '' ||
    useCases.length > 0 ||
    featured ||
    recommended

  return (
    <div
      id="fbar"
      className="bg-white border-b border-brand-border sticky z-[200] shadow-[0_1px_0_rgba(23,23,23,0.02)]"
      style={{ top: 'var(--hdr-h, 0px)' }}
    >
      {/* Category tabs */}
      <div className="flex items-stretch border-b border-brand-border overflow-x-auto scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => {
              updateParam('cat', cat.value === 'All' ? null : cat.value)
              trackEvent('filter_used', { filterState: { category: cat.value } })
            }}
            className={cn(
              'px-4 py-3.5 text-body-sm font-[700] text-brand-gray whitespace-nowrap',
              'border-b-2 border-transparent transition-all flex-shrink-0 flex items-center gap-[5px]',
              'hover:text-dg',
              category === cat.value && 'text-dg border-b-fg'
            )}
          >
            {cat.label}
            {cat.value !== 'All' && totalCounts[cat.value] !== undefined && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lg px-[7px] text-label leading-none align-middle font-[900] text-dg">
                {totalCounts[cat.value] ?? 0}
              </span>
            )}
            {cat.value === 'All' && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-lg px-[7px] text-label leading-none align-middle font-[900] text-dg">
                {Object.values(totalCounts).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search row */}
      <div className="flex items-center gap-3 px-5 py-3 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-40">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" />
          <input
            type="search"
            placeholder="Search prompts…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className={cn(
              'w-full h-10 pl-10 pr-8 border border-brand-border rounded-lg text-body-sm font-[700] text-brand-black bg-white',
              'placeholder:text-brand-gray focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20 transition-all'
            )}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={cn(
            'flex h-10 items-center gap-1.5 px-3.5 rounded-lg text-caption font-[700] transition-colors border',
            showFilters
              ? 'bg-dg text-white border-dg'
              : 'border-brand-border text-brand-gray hover:border-fg hover:text-dg'
          )}
        >
          <SlidersHorizontal size={13} />
          Filters
          {(level || useCases.length > 0 || featured || recommended) && (
            <span className="bg-fg text-white text-label font-[900] w-5 h-5 rounded-full flex items-center justify-center">
              {(level ? 1 : 0) + useCases.length + (featured ? 1 : 0) + (recommended ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-caption font-[700] text-brand-gray hover:text-dg transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Extended filters panel */}
      {showFilters && (
        <div className="px-5 py-4 border-t border-brand-border flex flex-wrap gap-x-8 gap-y-4 bg-cream/55">
          {/* Level */}
          <div className="flex flex-col gap-1.5">
            <span className="text-label font-[800] uppercase tracking-[0.08em] text-brand-gray">
              Level
            </span>
            <div className="flex gap-2">
              {(['', 'beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => updateParam('level', lvl || null)}
                  className={cn(
                    'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                    level === lvl
                      ? 'bg-dg text-white border-dg'
                      : 'bg-white border-brand-border text-brand-gray hover:border-fg hover:text-dg'
                  )}
                >
                  {lvl === '' ? 'Any' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Use cases */}
          <div className="flex flex-col gap-1.5">
            <span className="text-label font-[800] uppercase tracking-[0.08em] text-brand-gray">
              Use case
            </span>
            <div className="flex flex-wrap gap-2">
              {USE_CASE_OPTIONS.map(uc => {
                const active = useCases.includes(uc)
                return (
                  <button
                    key={uc}
                    onClick={() => {
                      const next = active
                        ? useCases.filter(u => u !== uc)
                        : [...useCases, uc]
                      updateParam('useCases', next.join(',') || null)
                    }}
                    className={cn(
                      'flex h-8 items-center gap-1 px-3 rounded-md text-caption font-[700] transition-colors border',
                      active
                        ? 'bg-dg text-white border-dg'
                        : 'bg-white border-brand-border text-brand-gray hover:border-fg hover:text-dg'
                    )}
                  >
                    {active && <Check size={10} />}
                    {USE_CASE_LABELS[uc]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Featured / Recommended */}
          <div className="flex flex-col gap-1.5">
            <span className="text-label font-[800] uppercase tracking-[0.08em] text-brand-gray">
              Curated
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => updateParam('featured', featured ? null : '1')}
                className={cn(
                  'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                  featured
                    ? 'bg-dg text-white border-dg'
                    : 'bg-white border-brand-border text-brand-gray hover:border-fg hover:text-dg'
                )}
              >
                Featured
              </button>
              <button
                onClick={() => updateParam('recommended', recommended ? null : '1')}
                className={cn(
                  'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                  recommended
                    ? 'bg-dg text-white border-dg'
                    : 'bg-white border-brand-border text-brand-gray hover:border-fg hover:text-dg'
                )}
              >
                Recommended
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
