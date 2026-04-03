import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { PromptDetailClient } from './PromptDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('prompts')
    .select('title, short_description')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Prompt not found' }

  return {
    title: `${data.title} — Sidekick`,
    description: data.short_description,
  }
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!prompt) notFound()

  // Fetch follow-up prompts if any
  let followUpPrompts = []
  if (prompt.follow_up_prompt_ids?.length > 0) {
    const { data } = await supabase
      .from('prompts')
      .select('id, slug, title, short_description, category')
      .in('id', prompt.follow_up_prompt_ids)
    followUpPrompts = data ?? []
  }

  return <PromptDetailClient prompt={prompt} followUpPrompts={followUpPrompts} />
}
