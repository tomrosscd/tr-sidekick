'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { cn, formatDate } from '@/lib/utils'
import { Star, Eye, Archive, ExternalLink } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CATEGORIES } from '@/types'
import type { Visibility, PromptStatus } from '@/types'

interface PromptRow {
  id: string
  slug: string
  title: string
  category: string
  visibility: Visibility
  status: PromptStatus
  is_featured: boolean
  is_recommended: boolean
  source_label: string | null
  created_at: string
}

interface Props {
  prompts: PromptRow[]
}

export function AdminPromptsClient({ prompts: initialPrompts }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [prompts, setPrompts] = useState(initialPrompts)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')

  const filtered = prompts.filter(p => {
    if (catFilter !== 'All' && p.category !== catFilter) return false
    if (search) {
      return p.title.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  const update = async (id: string, patch: Partial<PromptRow>) => {
    const { error } = await supabase
      .from('prompts')
      .update(patch)
      .eq('id', id)

    if (error) {
      toast.error('Update failed')
      return
    }

    setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
    toast.success('Updated')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-[26px] text-brand-black">Prompts</h1>
        <div className="text-[12px] text-brand-gray font-[600]">
          {filtered.length} of {prompts.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="search"
          placeholder="Search prompts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-fg"
        />
        <div className="w-40">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-brand-border bg-cream/50">
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray">Title</th>
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray hidden sm:table-cell">Cat</th>
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray">Visibility</th>
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray">Status</th>
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray">Featured</th>
              <th className="text-left px-4 py-3 font-[800] text-[10px] uppercase tracking-[0.1em] text-brand-gray">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-[700] text-brand-black">{p.title}</div>
                  {p.source_label && (
                    <div className="text-[10px] text-brand-gray mt-0.5">{p.source_label}</div>
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-brand-gray">{p.category}</td>

                {/* Visibility selector */}
                <td className="px-4 py-3">
                  <select
                    value={p.visibility}
                    onChange={e => update(p.id, { visibility: e.target.value as Visibility })}
                    className="text-[11.5px] font-[700] bg-transparent border border-brand-border rounded-md px-2 py-1 focus:outline-none focus:border-fg"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>

                {/* Status selector */}
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={e => update(p.id, { status: e.target.value as PromptStatus })}
                    className="text-[11.5px] font-[700] bg-transparent border border-brand-border rounded-md px-2 py-1 focus:outline-none focus:border-fg"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>

                {/* Featured toggle */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(p.id, { is_featured: !p.is_featured })}
                      className={cn(
                        'p-1.5 rounded-md transition-colors',
                        p.is_featured ? 'bg-lg text-dg' : 'text-brand-border hover:text-brand-gray'
                      )}
                      title="Toggle featured"
                    >
                      <Star size={13} fill={p.is_featured ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => update(p.id, { is_recommended: !p.is_recommended })}
                      className={cn(
                        'p-1.5 rounded-md transition-colors text-[9px] font-[700] border',
                        p.is_recommended
                          ? 'bg-lg/30 text-dg border-lg'
                          : 'border-brand-border text-brand-gray hover:border-fg'
                      )}
                      title="Toggle recommended"
                    >
                      Rec
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <Link
                    href={`/prompts/${p.slug}`}
                    target="_blank"
                    className="text-fg hover:underline flex items-center gap-1"
                  >
                    <ExternalLink size={11} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[13px] text-brand-gray">
            No prompts match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
