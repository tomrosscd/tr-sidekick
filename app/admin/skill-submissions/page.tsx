import { createClient } from '@/lib/supabase/server'
import { SkillSubmissionsClient } from './SkillSubmissionsClient'

export default async function SkillSubmissionsPage() {
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('skill_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return <SkillSubmissionsClient submissions={submissions ?? []} />
}
