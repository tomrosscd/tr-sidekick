'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn, slugify } from '@/lib/utils'
import { Plus, Trash2, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'
import type { PromptCollection, Visibility } from '@/types'

interface CollectionRow extends PromptCollection {
  items?: { count: number }[]
}

interface Props {
  collections: CollectionRow[]
  allPrompts: { id: string; title: string; category: string }[]
}

export function AdminCollectionsClient({ collections: initialCollections, allPrompts }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [collections, setCollections] = useState(initialCollections)
  const [showForm, setShowForm] = useState(false)
  const [working, setWorking] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    visibility: 'internal' as Visibility,
    is_featured: false,
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setWorking(true)

    const { data, error } = await supabase
      .from('prompt_collections')
      .insert({
        ...form,
        slug: slugify(form.title),
      })
      .select()
      .single()

    setWorking(false)

    if (error) {
      toast.error('Failed to create collection')
      return
    }

    toast.success('Collection created')
    setCollections(prev => [{ ...data, items: [{ count: 0 }] }, ...prev])
    setShowForm(false)
    setForm({ title: '', description: '', visibility: 'internal', is_featured: false })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection? Prompts will not be affected.')) return

    await supabase.from('prompt_collections').delete().eq('id', id)
    setCollections(prev => prev.filter(c => c.id !== id))
    toast.success('Collection deleted')
  }

  const toggleFeatured = async (collection: CollectionRow) => {
    await supabase
      .from('prompt_collections')
      .update({ is_featured: !collection.is_featured })
      .eq('id', collection.id)

    setCollections(prev =>
      prev.map(c => c.id === collection.id ? { ...c, is_featured: !c.is_featured } : c)
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-h2 text-brand-black">Collections</h1>
        <Button size="sm" onClick={() => setShowForm(v => !v)}>
          <Plus size={14} />
          New collection
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-brand-border rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-[800] text-body text-brand-black">New collection</h2>
          <div>
            <FormLabel htmlFor="col-title">Title</FormLabel>
            <Input
              id="col-title"
              placeholder="e.g. Post-Launch Review Pack"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor="col-desc">Description</FormLabel>
            <Textarea
              id="col-desc"
              placeholder="What is this collection for?"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <FormLabel>Visibility</FormLabel>
              <select
                value={form.visibility}
                onChange={e => setForm(p => ({ ...p, visibility: e.target.value as Visibility }))}
                className="h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[700] bg-white focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <Checkbox
                checked={form.is_featured}
                onCheckedChange={checked => setForm(p => ({ ...p, is_featured: checked === true }))}
              />
              <span className="text-caption font-[700] text-brand-gray">Featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={working}>
              {working ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      )}

      {/* Collections list */}
      <div className="space-y-3">
        {collections.length === 0 && (
          <div className="bg-white border border-brand-border rounded-xl p-8 text-center text-brand-gray text-body-sm font-[600]">
            No collections yet. Create one to get started.
          </div>
        )}

        {collections.map(collection => (
          <div
            key={collection.id}
            className="bg-white border border-brand-border rounded-xl px-5 py-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="font-[700] text-body text-brand-black">{collection.title}</div>
              {collection.description && (
                <div className="text-caption text-brand-gray font-[600] mt-0.5 truncate">
                  {collection.description}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1.5">
                <span className={cn(
                  'text-label font-[800] uppercase tracking-[0.08em] px-2 py-1 rounded-full',
                  collection.visibility === 'public' ? 'bg-[#e6f4ed] text-[#1a5c35]' :
                  collection.visibility === 'internal' ? 'bg-[#edf0f7] text-[#2d3d6b]' :
                  'bg-[#f0f0f0] text-[#444]'
                )}>
                  {collection.visibility}
                </span>
                <span className="text-caption text-brand-gray font-[600]">
                  {collection.items?.[0]?.count ?? 0} prompts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleFeatured(collection)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  collection.is_featured ? 'bg-lg text-dg' : 'text-brand-border hover:text-brand-gray'
                )}
                title="Toggle featured"
              >
                <Star size={14} fill={collection.is_featured ? 'currentColor' : 'none'} />
              </button>
              <Link
                href={`/collections/${collection.slug}`}
                target="_blank"
                className="p-1.5 rounded-md text-brand-gray hover:text-fg transition-colors"
              >
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={() => handleDelete(collection.id)}
                className="p-1.5 rounded-md text-brand-gray hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
