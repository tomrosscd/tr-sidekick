import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/Header'
import { PromptSubmitForm } from '@/components/PromptSubmitForm'
import { TimeframeProvider } from '@/components/TimeframeContext'
import { isInternalUser } from '@/lib/utils'

export default async function SubmitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isInternalUser(user.email)) {
    redirect('/login?reason=internal-only')
  }

  return (
    <TimeframeProvider>
      <Header showTimeframe={false} />
      <main className="max-w-2xl mx-auto px-5 py-8 pb-16">
        <div className="mb-8">
          <h1 className="font-serif text-[28px] text-brand-black mb-2">
            Submit a prompt
          </h1>
          <p className="text-[14px] text-brand-gray font-[500]">
            Contribute a new prompt to the library. Submissions are reviewed before publishing.
          </p>
        </div>
        <PromptSubmitForm />
      </main>
    </TimeframeProvider>
  )
}
