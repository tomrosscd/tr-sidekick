'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/Header'
import { SkillCard, SkillCardSkeleton } from '@/components/SkillCard'
import { SkillFilterBar } from '@/components/SkillFilterBar'
import { applySkillFilters, readSkillFilters, skillCategoryCounts } from '@/lib/skills'
import type { Skill } from '@/types'

export function SkillLibrary() {
  const searchParams = useSearchParams()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'published')
        .order('updated_at', { ascending: false })

      setSkills((data as Skill[]) ?? [])
      setLoading(false)
    }
    load()
  }, [supabase])

  const filters = useMemo(() => readSkillFilters(new URLSearchParams(searchParams.toString())), [searchParams])
  const filtered = useMemo(() => applySkillFilters(skills, filters), [skills, filters])
  const counts = useMemo(() => skillCategoryCounts(skills), [skills])
  const owners = useMemo(() => [...new Set(skills.map(s => s.owner_name).filter(Boolean) as string[])], [skills])

  return (
    <>
      <Header showTimeframe={false} />
      <SkillFilterBar categoryCounts={counts} ownerOptions={owners} />
      <main
        className="max-w-[1500px] mx-auto px-5 py-6 pb-16 min-h-[60vh]"
        style={{ background: 'var(--shell-bg)' }}
      >
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <span className="text-body-sm text-brand-gray font-[700]">
            Showing <strong className="text-dg">{loading ? '…' : filtered.length}</strong> skill{filtered.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-serif text-h2 text-dg mb-2">No skills found</h3>
            <p className="text-body-sm text-brand-gray font-[600]">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
