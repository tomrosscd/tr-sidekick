'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { ExternalLink, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { SkillStatus, SkillVisibility } from '@/types'

interface SkillRow {
  id: string
  slug: string
  title: string
  category: string
  visibility: SkillVisibility
  status: SkillStatus
  is_featured: boolean
  is_recommended: boolean
  owner_name: string | null
  updated_at: string
}

interface Props {
  skills: SkillRow[]
}

export function AdminSkillsClient({ skills: initialSkills }: Props) {
  const supabase = createClient()
  const [skills, setSkills] = useState(initialSkills)
  const [search, setSearch] = useState('')

  const filtered = skills.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  const update = async (id: string, patch: Partial<SkillRow>) => {
    const { error } = await supabase.from('skills').update(patch).eq('id', id)
    if (error) {
      toast.error('Update failed')
      return
    }
    setSkills(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
    toast.success('Updated')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-h2 text-brand-black">Skills</h1>
        <div className="text-caption text-brand-gray font-[700]">{filtered.length} of {skills.length}</div>
      </div>

      <div className="mb-5">
        <input
          type="search"
          placeholder="Search skills…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[700] bg-white focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20"
        />
      </div>

      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-brand-border bg-cream/50">
              <th className="text-left px-4 py-3.5 text-label text-brand-gray">Title</th>
              <th className="text-left px-4 py-3.5 text-label text-brand-gray hidden sm:table-cell">Category</th>
              <th className="text-left px-4 py-3.5 text-label text-brand-gray">Visibility</th>
              <th className="text-left px-4 py-3.5 text-label text-brand-gray">Status</th>
              <th className="text-left px-4 py-3.5 text-label text-brand-gray">Curated</th>
              <th className="text-left px-4 py-3.5 text-label text-brand-gray">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.map(skill => (
              <tr key={skill.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-[700] text-body-sm text-brand-black">{skill.title}</div>
                  <div className="text-caption text-brand-gray font-[600]">{skill.owner_name ?? 'No owner'}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-brand-gray">{skill.category}</td>
                <td className="px-4 py-3">
                  <select
                    value={skill.visibility}
                    onChange={e => update(skill.id, { visibility: e.target.value as SkillVisibility })}
                    className="h-8 text-caption font-[700] bg-white border border-brand-border rounded-md px-2.5"
                  >
                    <option value="internal">Internal</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={skill.status}
                    onChange={e => update(skill.id, { status: e.target.value as SkillStatus })}
                    className="h-8 text-caption font-[700] bg-white border border-brand-border rounded-md px-2.5"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(skill.id, { is_featured: !skill.is_featured })}
                      className={cn('p-1.5 rounded-md transition-colors', skill.is_featured ? 'bg-lg text-dg' : 'text-brand-border hover:text-brand-gray')}
                      title="Toggle featured"
                    >
                      <Star size={13} fill={skill.is_featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => update(skill.id, { is_recommended: !skill.is_recommended })}
                      className={cn('p-1.5 rounded-md transition-colors text-label border', skill.is_recommended ? 'bg-lg/30 text-dg border-lg' : 'border-brand-border text-brand-gray')}
                    >
                      Rec
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/skills/${skill.slug}`} target="_blank" className="text-fg hover:underline flex items-center gap-1 text-caption font-[700]">
                    <ExternalLink size={11} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
