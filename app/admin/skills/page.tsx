import { createClient } from '@/lib/supabase/server'
import { AdminSkillsClient } from './AdminSkillsClient'

export default async function AdminSkillsPage() {
  const supabase = await createClient()

  const { data: skills } = await supabase
    .from('skills')
    .select('id, slug, title, category, visibility, status, is_featured, is_recommended, owner_name, updated_at')
    .order('updated_at', { ascending: false })

  return <AdminSkillsClient skills={skills ?? []} />
}
