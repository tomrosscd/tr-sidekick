import { createClient } from '@/lib/supabase/server'
import { SubmissionsClient } from './SubmissionsClient'

export default async function SubmissionsPage() {
  const supabase = await createClient()

  const { data: submissions } = await supabase
    .from('prompt_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  return <SubmissionsClient submissions={submissions ?? []} />
}
