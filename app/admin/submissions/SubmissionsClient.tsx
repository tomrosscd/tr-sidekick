'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/label'
import { cn, formatDate, slugify } from '@/lib/utils'
import { Check, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import type { PromptSubmission } from '@/types'

interface Props {
  submissions: PromptSubmission[]
}

export function SubmissionsClient({ submissions }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<PromptSubmission | null>(null)
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [working, setWorking] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filtered = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter)

  const handleApprove = async (submission: PromptSubmission) => {
    setWorking(true)
    try {
      // 1. Create the prompt (return id for version wiring)
      const { data: newPrompt, error: promptError } = await supabase
        .from('prompts')
        .insert({
          slug: slugify(submission.title),
          title: submission.title,
          short_description: submission.short_description,
          prompt_body: submission.prompt_body,
          category: submission.category,
          use_cases: submission.use_cases,
          data_sources: submission.data_sources,
          visibility: 'internal',
          status: 'published',
          source_label: 'Convert',
          owner_name: submission.submitter_name,
          created_by: submission.submitted_by,
          version: 1,
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (promptError || !newPrompt) throw promptError ?? new Error('No prompt returned')

      // 2. Create version 1 record for this prompt
      const { data: newVersion, error: versionError } = await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: newPrompt.id,
          version_number: 1,
          prompt_body: submission.prompt_body,
          change_notes: 'Initial version',
          created_by: submission.submitted_by,
          created_by_name: submission.submitter_name,
        })
        .select('id')
        .single()

      if (versionError || !newVersion) throw versionError ?? new Error('No version returned')

      // 3. Wire current_version_id back to the new version
      await supabase
        .from('prompts')
        .update({ current_version_id: newVersion.id })
        .eq('id', newPrompt.id)

      // 4. Mark submission as approved
      await supabase
        .from('prompt_submissions')
        .update({
          status: 'approved',
          reviewer_notes: reviewerNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submission.id)

      toast.success('Submission approved and prompt published')
      setSelected(null)
      setReviewerNotes('')
      router.refresh()
    } catch (e) {
      console.error(e)
      toast.error('Something went wrong')
    } finally {
      setWorking(false)
    }
  }

  const handleReject = async (submission: PromptSubmission) => {
    setWorking(true)
    await supabase
      .from('prompt_submissions')
      .update({
        status: 'rejected',
        reviewer_notes: reviewerNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission.id)

    toast.success('Submission rejected')
    setSelected(null)
    setReviewerNotes('')
    setWorking(false)
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-h2 text-brand-black">Submissions</h1>
        {/* Filter tabs */}
        <div className="flex border border-brand-border rounded-lg p-[3px] gap-0.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'h-8 px-3 rounded-md text-caption font-[700] transition-colors',
                filter === f
                  ? 'bg-dg text-white'
                  : 'text-brand-gray hover:text-dg'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 text-label">
                {f === 'all' ? submissions.length : submissions.filter(s => s.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white border border-brand-border rounded-xl p-8 text-center text-brand-gray text-body-sm font-[600]">
            No {filter === 'all' ? '' : filter} submissions.
          </div>
        )}

        {filtered.map(submission => (
          <div
            key={submission.id}
            className="bg-white border border-brand-border rounded-xl overflow-hidden"
          >
            {/* Summary row */}
            <div
              className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-cream/50 transition-colors"
              onClick={() => setSelected(selected?.id === submission.id ? null : submission)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-[700] text-body text-brand-black truncate">{submission.title}</div>
                <div className="text-caption text-brand-gray font-[600] mt-0.5">
                  {submission.submitter_name} &lt;{submission.submitter_email}&gt; · {formatDate(submission.created_at)}
                </div>
              </div>
              <span className={cn(
                'meta-pill px-2.5 py-1 flex-shrink-0',
                submission.status === 'pending' && 'bg-[#fff0e6] text-[#a84a00]',
                submission.status === 'approved' && 'bg-[#e6f4ed] text-[#1a5c35]',
                submission.status === 'rejected' && 'bg-[#f0f0f0] text-[#444]',
              )}>
                {submission.status}
              </span>
              {selected?.id === submission.id
                ? <ChevronUp size={16} className="text-brand-gray flex-shrink-0" />
                : <ChevronDown size={16} className="text-brand-gray flex-shrink-0" />
              }
            </div>

            {/* Detail panel */}
            {selected?.id === submission.id && (
              <div className="border-t border-brand-border px-5 py-5 space-y-4">
                {submission.short_description && (
                  <div>
                    <div className="type-label mb-1">
                      Description
                    </div>
                    <p className="text-body-sm text-brand-text font-[600]">
                      {submission.short_description}
                    </p>
                  </div>
                )}

                <div>
                  <div className="type-label mb-1">
                    Category
                  </div>
                  <span className="text-caption font-[700] text-brand-black">{submission.category}</span>
                </div>

                <div>
                  <div className="type-label mb-1.5">
                    Prompt body
                  </div>
                  <pre className="bg-cream border border-brand-border rounded-lg p-4 text-body-sm text-brand-text whitespace-pre-wrap font-sans font-[600] leading-relaxed max-h-64 overflow-y-auto">
                    {submission.prompt_body}
                  </pre>
                </div>

                {submission.notes && (
                  <div>
                    <div className="type-label mb-1">
                      Notes from submitter
                    </div>
                    <p className="text-body-sm text-brand-text font-[600]">{submission.notes}</p>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div>
                    <FormLabel htmlFor="reviewer-notes">Reviewer notes (optional)</FormLabel>
                    <Textarea
                      id="reviewer-notes"
                      placeholder="Add notes for the submitter or for your records…"
                      value={reviewerNotes}
                      onChange={e => setReviewerNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {submission.reviewer_notes && submission.status !== 'pending' && (
                  <div>
                    <div className="type-label mb-1">
                      Reviewer notes
                    </div>
                    <p className="text-body-sm text-brand-text font-[600]">{submission.reviewer_notes}</p>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(submission)}
                      disabled={working}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <X size={13} />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(submission)}
                      disabled={working}
                    >
                      <Check size={13} />
                      Approve &amp; publish
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
