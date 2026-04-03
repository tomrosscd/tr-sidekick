'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import { PromptCard } from '@/components/PromptCard'
import { TimeframeProvider } from '@/components/TimeframeContext'
import type { Prompt, PromptCollection } from '@/types'

interface Props {
  collection: PromptCollection
  prompts: Prompt[]
}

export function CollectionDetailClient({ collection, prompts }: Props) {
  return (
    <TimeframeProvider>
      <Header showTimeframe />
      <main className="max-w-[1200px] mx-auto px-5 py-6 pb-16">
        <div className="mb-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-body-sm font-[700] text-brand-gray hover:text-dg transition-colors"
          >
            <ArrowLeft size={13} />
            All collections
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="section-title mb-2">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-body text-brand-gray font-[600] leading-relaxed max-w-2xl">
              {collection.description}
            </p>
          )}
          <div className="mt-3 text-caption font-[700] text-brand-gray">
            {prompts.length} prompt{prompts.length !== 1 ? 's' : ''} in this collection
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-gray text-body-sm font-[600]">No prompts in this collection yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {prompts.map(p => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </main>
    </TimeframeProvider>
  )
}
