import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isInternalUser } from '@/lib/utils'
import { Header } from '@/components/Header'
import { SkillSubmitForm } from '@/components/SkillSubmitForm'

export default async function SkillSubmitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isInternalUser(user.email)) {
    redirect('/login?reason=internal-only')
  }

  const { data: skills } = await supabase
    .from('skills')
    .select('id, title, slug')
    .order('title')

  return (
    <>
      <Header showTimeframe={false} />
      <main className="max-w-2xl mx-auto px-5 py-8 pb-16">
        <div className="mb-8">
          <h1 className="section-title mb-2">Submit a Claude Skill</h1>
          <p className="section-subtitle">
            Submit a new skill or a version update for review.
          </p>
        </div>
        <SkillSubmitForm skills={skills ?? []} />
      </main>
    </>
  )
}
