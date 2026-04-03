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
  const source = searchParams.get('src') ?? 'all'
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
    source !== 'all' ||
    search !== '' ||
    level !== '' ||
    useCases.length > 0 ||
    featured ||
    recommended

  return (
    <div
      id="fbar"
      className="bg-white border-b border-brand-border sticky z-[200]"
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
              'px-[13px] py-3 text-[13px] font-[700] text-brand-gray whitespace-nowrap',
              'border-b-2 border-transparent transition-all flex-shrink-0 flex items-center gap-[5px]',
              'hover:text-dg',
              category === cat.value && 'text-dg border-b-fg'
            )}
          >
            {cat.label}
            {cat.value !== 'All' && totalCounts[cat.value] !== undefined && (
              <span className="bg-lg text-dg text-[9px] font-[900] px-[6px] py-[1px] rounded-[10px] min-w-[18px] text-center">
                {totalCounts[cat.value] ?? 0}
              </span>
            )}
            {cat.value === 'All' && (
              <span className="bg-lg text-dg text-[9px] font-[900] px-[6px] py-[1px] rounded-[10px] min-w-[18px] text-center">
                {Object.values(totalCounts).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2.5 px-5 py-2 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-40">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search prompts…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className={cn(
              'w-full pl-[30px] pr-8 py-[7px] border border-brand-border rounded-[7px] text-[13px] text-brand-black bg-cream',
              'placeholder:text-brand-gray focus:outline-none focus:border-fg transition-colors'
            )}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Source toggle */}
        <div className="flex border border-brand-border rounded-[7px] p-[3px] flex-shrink-0">
          {(['all', 'convert', 'shopify'] as const).map(src => (
            <button
              key={src}
              onClick={() => updateParam('src', src === 'all' ? null : src)}
              className={cn(
                'px-3 py-[5px] rounded-[5px] text-[12px] font-[800] tracking-[0.04em] transition-all whitespace-nowrap',
                source === src
                  ? 'bg-dg text-white'
                  : 'text-brand-gray hover:bg-lg hover:text-dg'
              )}
            >
              {src === 'all' ? 'All' : src.charAt(0).toUpperCase() + src.slice(1)}
            </button>
          ))}
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-[7px] rounded-[7px] text-[12px] font-[700] transition-colors border',
            showFilters
              ? 'bg-dg text-white border-dg'
              : 'border-brand-border text-brand-gray hover:border-fg hover:text-dg'
          )}
        >
          <SlidersHorizontal size={13} />
          Filters
          {(level || useCases.length > 0 || featured || recommended) && (
            <span className="bg-fg text-white text-[9px] font-[900] w-4 h-4 rounded-full flex items-center justify-center">
              {(level ? 1 : 0) + useCases.length + (featured ? 1 : 0) + (recommended ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[12px] font-[700] text-brand-gray hover:text-dg transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Extended filters panel */}
      {showFilters && (
        <div className="px-5 py-3 border-t border-brand-border flex flex-wrap gap-x-6 gap-y-3 bg-cream/50">
          {/* Level */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-[800] uppercase tracking-[0.14em] text-brand-gray">
              Level
            </span>
            <div className="flex gap-1.5">
              {(['', 'beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => updateParam('level', lvl || null)}
                  className={cn(
                    'px-2.5 py-1 rounded-[5px] text-[11.5px] font-[700] transition-colors border',
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
            <span className="text-[9px] font-[800] uppercase tracking-[0.14em] text-brand-gray">
              Use case
            </span>
            <div className="flex flex-wrap gap-1.5">
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
                      'flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-[11.5px] font-[700] transition-colors border',
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
            <span className="text-[9px] font-[800] uppercase tracking-[0.14em] text-brand-gray">
              Curated
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => updateParam('featured', featured ? null : '1')}
                className={cn(
                  'px-2.5 py-1 rounded-[5px] text-[11.5px] font-[700] transition-colors border',
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
                  'px-2.5 py-1 rounded-[5px] text-[11.5px] font-[700] transition-colors border',
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
