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
        <h1 className="font-serif text-h2 text-brand-black">Prompts</h1>
        <div className="text-caption text-brand-gray font-[700]">
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
          className="flex-1 h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[600] bg-white focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20"
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
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-brand-border bg-cream/50">
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray">Title</th>
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray hidden sm:table-cell">Cat</th>
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray">Visibility</th>
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray">Status</th>
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray">Featured</th>
              <th className="text-left px-4 py-3.5 text-label uppercase tracking-[0.08em] text-brand-gray">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-[700] text-brand-black text-body-sm">{p.title}</div>
                  {p.source_label && (
                    <div className="text-label text-brand-gray mt-0.5">{p.source_label}</div>
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-brand-gray">{p.category}</td>

                {/* Visibility selector */}
                <td className="px-4 py-3">
                  <select
                    value={p.visibility}
                    onChange={e => update(p.id, { visibility: e.target.value as Visibility })}
                    className="h-8 text-caption font-[700] bg-white border border-brand-border rounded-md px-2.5 focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20"
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
                    className="h-8 text-caption font-[700] bg-white border border-brand-border rounded-md px-2.5 focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20"
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
                        'p-1.5 rounded-md transition-colors text-label font-[700] border',
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
                    className="text-fg hover:underline flex items-center gap-1 text-caption font-[700]"
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
          <div className="py-10 text-center text-body-sm text-brand-gray font-[600]">
            No prompts match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
