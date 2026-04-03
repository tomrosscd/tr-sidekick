import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { TimeframeProvider } from '@/components/TimeframeContext'
import type { PromptCollection } from '@/types'
import { BookOpen } from 'lucide-react'

export default async function CollectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('prompt_collections')
    .select(`
      *,
      items:prompt_collection_items(count)
    `)
    .order('created_at', { ascending: false })

  // Visibility: if not internal user, only show public
  const isInternal = user?.email?.endsWith('@convertdigital.com.au')
  if (!isInternal) {
    query = query.eq('visibility', 'public')
  }

  const { data: collections } = await query

  return (
    <TimeframeProvider>
      <Header showTimeframe={false} />
      <main className="max-w-5xl mx-auto px-5 py-8 pb-16">
        <div className="mb-8">
          <h1 className="section-title mb-2">
            Prompt Collections
          </h1>
          <p className="section-subtitle">
            Curated sets of prompts for common ecommerce scenarios.
          </p>
        </div>

        {!collections?.length ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-serif text-h2 text-dg mb-2">No collections yet</h3>
            <p className="text-brand-gray text-body-sm font-[600]">Collections will appear here once they're created.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection: PromptCollection & { items?: { count: number }[] }) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="surface-card p-5 hover:border-fg hover:shadow-card-hover transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-dg/8 rounded-lg flex items-center justify-center">
                    <BookOpen size={18} className="text-dg" />
                  </div>
                  {collection.is_featured && (
                    <span className="meta-pill bg-lg/30 text-dg">
                      Featured
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-h3 text-brand-black mb-1.5 group-hover:text-fg transition-colors leading-tight">
                  {collection.title}
                </h2>
                {collection.description && (
                  <p className="text-body-sm text-brand-gray font-[600] leading-relaxed mb-3">
                    {collection.description}
                  </p>
                )}
                <div className="text-caption text-brand-gray font-[700]">
                  {(collection.items as Array<{count: number}>)?.[0]?.count ?? 0} prompts
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </TimeframeProvider>
  )
}
