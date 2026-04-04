import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { Prompt, PromptVersion } from '@/types'
import { PromptDetailClient } from './PromptDetailClient'

type FollowUpPrompt = Pick<Prompt, 'id' | 'slug' | 'title' | 'short_description' | 'category'>

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

  // Fetch all versions for this prompt, newest first
  const { data: versionsData } = await supabase
    .from('prompt_versions')
    .select('*')
    .eq('prompt_id', prompt.id)
    .order('version_number', { ascending: false })

  const versions = (versionsData as PromptVersion[] | null) ?? []

  // Fetch follow-up prompts if any
  let followUpPrompts: FollowUpPrompt[] = []
  if (prompt.follow_up_prompt_ids?.length > 0) {
    const { data } = await supabase
      .from('prompts')
      .select('id, slug, title, short_description, category')
      .in('id', prompt.follow_up_prompt_ids)
    followUpPrompts = (data as FollowUpPrompt[] | null) ?? []
  }

  return (
    <PromptDetailClient
      prompt={prompt}
      versions={versions}
      followUpPrompts={followUpPrompts}
    />
  )
}
