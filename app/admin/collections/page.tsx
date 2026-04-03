import { createClient } from '@/lib/supabase/server'
import { AdminCollectionsClient } from './AdminCollectionsClient'

export default async function AdminCollectionsPage() {
  const supabase = await createClient()

  const { data: collections } = await supabase
    .from('prompt_collections')
    .select(`*, items:prompt_collection_items(count)`)
    .order('created_at', { ascending: false })

  const { data: prompts } = await supabase
    .from('prompts')
    .select('id, title, category')
    .eq('status', 'published')
    .order('title')

  return (
    <AdminCollectionsClient
      collections={collections ?? []}
      allPrompts={prompts ?? []}
    />
  )
}
