import { createClient } from '@/lib/supabase/server'
import { AdminPromptsClient } from './AdminPromptsClient'

export default async function AdminPromptsPage() {
  const supabase = await createClient()

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, slug, title, category, visibility, status, is_featured, is_recommended, source_label, created_at')
    .order('created_at', { ascending: false })

  return <AdminPromptsClient prompts={prompts ?? []} />
}
