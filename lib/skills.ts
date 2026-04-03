import type { Skill } from '@/types'

export interface SkillFilterState {
  q: string
  category: string
  useCases: string[]
  owner: string
  featured: boolean
  recommended: boolean
}

export function readSkillFilters(params: URLSearchParams): SkillFilterState {
  const useCasesRaw = params.get('useCases') ?? ''
  return {
    q: params.get('q') ?? '',
    category: params.get('category') ?? 'All',
    useCases: useCasesRaw ? useCasesRaw.split(',').filter(Boolean) : [],
    owner: params.get('owner') ?? '',
    featured: params.get('featured') === '1',
    recommended: params.get('recommended') === '1',
  }
}

export function applySkillFilters(skills: Skill[], filters: SkillFilterState): Skill[] {
  return skills.filter(skill => {
    if (filters.category !== 'All' && skill.category !== filters.category) return false
    if (filters.owner && skill.owner_name !== filters.owner) return false
    if (filters.featured && !skill.is_featured) return false
    if (filters.recommended && !skill.is_recommended) return false
    if (filters.useCases.length > 0 && !filters.useCases.some(u => skill.use_cases?.includes(u))) return false

    if (filters.q.trim()) {
      const q = filters.q.toLowerCase()
      return (
        skill.title.toLowerCase().includes(q) ||
        skill.short_description?.toLowerCase().includes(q) ||
        skill.owner_name?.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        skill.use_cases.some(uc => uc.toLowerCase().includes(q))
      )
    }
    return true
  })
}

export function skillCategoryCounts(skills: Skill[]): Record<string, number> {
  return skills.reduce<Record<string, number>>((acc, skill) => {
    acc[skill.category] = (acc[skill.category] ?? 0) + 1
    return acc
  }, {})
}
