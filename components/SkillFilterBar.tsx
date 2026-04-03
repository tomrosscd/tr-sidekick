'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SKILL_CATEGORIES, SKILL_USE_CASE_LABELS } from '@/types'

interface SkillFilterBarProps {
  categoryCounts: Record<string, number>
  ownerOptions: string[]
}

export function SkillFilterBar({ categoryCounts, ownerOptions }: SkillFilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const category = searchParams.get('category') ?? 'All'
  const search = searchParams.get('q') ?? ''
  const owner = searchParams.get('owner') ?? ''
  const useCases = searchParams.get('useCases')?.split(',').filter(Boolean) ?? []
  const featured = searchParams.get('featured') === '1'
  const recommended = searchParams.get('recommended') === '1'

  const [showFilters, setShowFilters] = useState(false)
  const [localSearch, setLocalSearch] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const categories = useMemo(() => ['All', ...SKILL_CATEGORIES], [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (localSearch !== search) updateParam('q', localSearch || null)
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [localSearch, search])

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value) params.delete(key)
    else params.set(key, value)
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const hasFilters = category !== 'All' || search !== '' || owner !== '' || useCases.length > 0 || featured || recommended

  return (
    <div
      id="fbar"
      className="sticky z-[200]"
      style={{
        top: 'var(--hdr-h, 0px)',
        background: 'var(--filter-bar-bg)',
        borderBottom: '1px solid var(--filter-border)',
      }}
    >
      <div
        className="flex items-stretch overflow-x-auto scrollbar-none border-b"
        style={{ borderColor: 'var(--filter-border)' }}
      >
        {categories.map(cat => {
          const count = cat === 'All' ? Object.values(categoryCounts).reduce((a, b) => a + b, 0) : (categoryCounts[cat] ?? 0)
          return (
            <button
              key={cat}
              onClick={() => updateParam('category', cat === 'All' ? null : cat)}
              className={cn(
                'px-4 py-3.5 text-body-sm whitespace-nowrap border-b-2 border-transparent transition-all flex-shrink-0 flex items-center gap-[5px]',
                'hover:text-[var(--filter-tab-active-fg)]',
                category === cat
                  ? 'font-[800] text-[var(--filter-tab-active-fg)] border-b-[var(--filter-tab-active-border)] bg-[var(--filter-tab-active-bg)]'
                  : 'font-[700] text-[var(--filter-tab-inactive-fg)]'
              )}
            >
              {cat}
              <span
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-[7px] text-label font-[900]"
                style={{ background: 'var(--filter-chip-bg)', color: 'var(--filter-chip-fg)' }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 px-5 py-3 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"
            style={{ color: 'var(--filter-tab-inactive-fg)' }}
          />
          <input
            type="search"
            placeholder="Search skills…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-8 rounded-lg text-body-sm font-[700] text-[var(--filter-tab-active-fg)] placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--filter-input-focus-ring)]/25 transition-all"
            style={{
              background: 'var(--filter-bar-bg)',
              border: '1px solid var(--filter-input-border)',
            }}
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              style={{ color: 'var(--filter-tab-active-fg)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          className={cn(
            'flex h-10 items-center gap-1.5 px-3.5 rounded-lg text-caption font-[700] transition-colors border',
            showFilters ? 'border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
          )}
          style={
            showFilters
              ? {
                  background: 'var(--filter-btn-active-bg)',
                  color: 'var(--filter-btn-active-fg)',
                  borderColor: 'var(--filter-btn-active-bg)',
                }
              : {
                  background: 'var(--filter-bar-bg)',
                  borderColor: 'var(--filter-input-border)',
                }
          }
        >
          <SlidersHorizontal size={13} />
          Filters
        </button>

        {hasFilters && (
          <button
            onClick={() => router.replace(pathname, { scroll: false })}
            className="text-caption font-[700] transition-colors hover:text-[var(--filter-clear-hover-fg)]"
            style={{ color: 'var(--filter-tab-inactive-fg)' }}
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div
          className="px-5 py-4 border-t flex flex-wrap gap-x-8 gap-y-4"
          style={{ borderColor: 'var(--filter-border)', background: 'var(--filter-panel-bg)' }}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className="type-label"
              style={{ color: 'var(--filter-tab-inactive-fg)' }}
            >
              Owner
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParam('owner', null)}
                className={cn(
                  'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                  owner === '' ? 'text-[var(--filter-btn-active-fg)] border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
                )}
                style={
                  owner === ''
                    ? { background: 'var(--filter-btn-active-bg)', borderColor: 'var(--filter-btn-active-bg)' }
                    : { background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)' }
                }
              >
                Any
              </button>
              {ownerOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => updateParam('owner', opt)}
                  className={cn(
                    'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                    owner === opt ? 'text-[var(--filter-btn-active-fg)] border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
                  )}
                  style={
                    owner === opt
                      ? { background: 'var(--filter-btn-active-bg)', borderColor: 'var(--filter-btn-active-bg)' }
                      : { background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)' }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="type-label" style={{ color: 'var(--filter-tab-inactive-fg)' }}>
              Use case
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SKILL_USE_CASE_LABELS).map(([key, label]) => {
                const active = useCases.includes(key)
                return (
                  <button
                    key={key}
                    onClick={() => {
                      const next = active ? useCases.filter(v => v !== key) : [...useCases, key]
                      updateParam('useCases', next.join(',') || null)
                    }}
                    className={cn(
                      'h-8 px-3 rounded-md text-caption font-[700] transition-colors border',
                      active ? 'text-[var(--filter-btn-active-fg)] border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
                    )}
                    style={
                      active
                        ? { background: 'var(--filter-btn-active-bg)', borderColor: 'var(--filter-btn-active-bg)' }
                        : { background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)' }
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="type-label" style={{ color: 'var(--filter-tab-inactive-fg)' }}>
              Curated
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => updateParam('featured', featured ? null : '1')}
                className={cn(
                  'h-8 px-3 rounded-md text-caption font-[700] border',
                  featured ? 'text-[var(--filter-btn-active-fg)] border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
                )}
                style={
                  featured
                    ? { background: 'var(--filter-btn-active-bg)', borderColor: 'var(--filter-btn-active-bg)' }
                    : { background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)' }
                }
              >
                Featured
              </button>
              <button
                onClick={() => updateParam('recommended', recommended ? null : '1')}
                className={cn(
                  'h-8 px-3 rounded-md text-caption font-[700] border',
                  recommended ? 'text-[var(--filter-btn-active-fg)] border-transparent' : 'text-[var(--filter-tab-inactive-fg)]'
                )}
                style={
                  recommended
                    ? { background: 'var(--filter-btn-active-bg)', borderColor: 'var(--filter-btn-active-bg)' }
                    : { background: 'var(--filter-bar-bg)', borderColor: 'var(--filter-input-border)' }
                }
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
