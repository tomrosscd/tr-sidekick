import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isInternalUser } from '@/lib/utils'
import { SkillLibrary } from '@/components/SkillLibrary'

export default async function SkillsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isInternalUser(user.email)) {
    redirect('/login?reason=internal-only')
  }

  return <SkillLibrary />
}
