import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { isInternalUser } from '@/lib/utils'
import { getSkillsBucketName } from '@/lib/skills-storage'
import type { Skill, SkillFile, SkillVersion } from '@/types'
import { SkillDetailClient } from './SkillDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('title, short_description').eq('slug', slug).single()
  if (!data) return { title: 'Skill not found' }
  return {
    title: `${data.title} — Claude Skills`,
    description: data.short_description ?? undefined,
  }
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isInternalUser(user.email)) {
    redirect('/login?reason=internal-only')
  }

  const { data: skill } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!skill) notFound()

  const { data: versions } = await supabase
    .from('skill_versions')
    .select('*')
    .eq('skill_id', skill.id)
    .eq('status', 'published')
    .order('version_number', { ascending: false })

  const currentVersion = (versions ?? []).find(v => v.id === skill.current_version_id) ?? (versions ?? [])[0] ?? null

  const versionIds = (versions ?? []).map(v => v.id)
  const { data: files } = versionIds.length > 0
    ? await supabase.from('skill_files').select('*').in('skill_version_id', versionIds).order('uploaded_at', { ascending: false })
    : { data: [] as SkillFile[] }

  const filesByVersion = (files ?? []).reduce<Record<string, SkillFile[]>>((acc, file) => {
    if (!file.skill_version_id) return acc
    acc[file.skill_version_id] = [...(acc[file.skill_version_id] ?? []), file]
    return acc
  }, {})

  const signedFileUrls: Record<string, string> = {}
  for (const file of files ?? []) {
    const { data } = await supabase.storage.from(getSkillsBucketName()).createSignedUrl(file.storage_path, 60 * 30)
    if (data?.signedUrl) signedFileUrls[file.id] = data.signedUrl
  }

  return (
    <SkillDetailClient
      skill={skill as Skill}
      currentVersion={(currentVersion as SkillVersion | null) ?? null}
      versions={(versions as SkillVersion[]) ?? []}
      filesByVersion={filesByVersion}
      signedFileUrls={signedFileUrls}
    />
  )
}
