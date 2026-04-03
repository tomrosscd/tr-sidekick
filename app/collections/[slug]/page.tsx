import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { CollectionDetailClient } from './CollectionDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('prompt_collections')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Collection not found' }
  return { title: `${data.title} — Sidekick`, description: data.description }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from('prompt_collections')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!collection) notFound()

  const { data: items } = await supabase
    .from('prompt_collection_items')
    .select(`
      sort_order,
      prompt:prompts(*)
    `)
    .eq('collection_id', collection.id)
    .order('sort_order')

  const prompts = items?.map(item => item.prompt).filter(Boolean) ?? []

  return (
    <CollectionDetailClient collection={collection} prompts={prompts as any[]} />
  )
}
