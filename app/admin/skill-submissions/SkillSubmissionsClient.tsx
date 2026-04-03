'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/label'
import { cn, slugify } from '@/lib/utils'
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import type { SkillSubmission } from '@/types'

interface Props {
  submissions: SkillSubmission[]
}

export function SkillSubmissionsClient({ submissions }: Props) {
  const supabase = createClient()
  const [selected, setSelected] = useState<SkillSubmission | null>(null)
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [working, setWorking] = useState(false)

  const approve = async (submission: SkillSubmission) => {
    setWorking(true)
    try {
      let skillId = submission.skill_id

      if (submission.submission_type === 'new' || !submission.skill_id) {
        const { data: skill, error: skillError } = await supabase
          .from('skills')
          .insert({
            slug: slugify(submission.title),
            title: submission.title,
            short_description: submission.short_description,
            category: submission.category,
            use_cases: submission.use_cases,
            owner_name: submission.owner_name,
            visibility: 'internal',
            status: 'published',
            created_by: submission.submitted_by,
            updated_by: submission.submitted_by,
          })
          .select('id')
          .single()

        if (skillError || !skill) throw skillError ?? new Error('Failed to create skill')
        skillId = skill.id
      }

      const { data: version, error: versionError } = await supabase
        .from('skill_versions')
        .insert({
          skill_id: skillId,
          version_number: submission.version_number ?? 1,
          version_label: submission.version_label,
          changelog: submission.changelog,
          content_markdown: submission.content_markdown,
          status: 'published',
          created_by: submission.submitted_by,
        })
        .select('id')
        .single()

      if (versionError || !version) throw versionError ?? new Error('Failed to create version')

      const { error: skillUpdateError } = await supabase
        .from('skills')
        .update({
          current_version_id: version.id,
          updated_by: submission.submitted_by,
          status: 'published',
        })
        .eq('id', skillId)
      if (skillUpdateError) throw skillUpdateError

      const { error: filesUpdateError } = await supabase
        .from('skill_files')
        .update({ skill_id: skillId, skill_version_id: version.id })
        .eq('submission_id', submission.id)
      if (filesUpdateError) throw filesUpdateError

      const { error: submissionUpdateError } = await supabase
        .from('skill_submissions')
        .update({
          status: 'approved',
          reviewer_notes: reviewerNotes || null,
          reviewed_at: new Date().toISOString(),
          skill_id: skillId,
        })
        .eq('id', submission.id)

      if (submissionUpdateError) throw submissionUpdateError
      toast.success('Skill submission approved')
      window.location.reload()
    } catch (e) {
      console.error(e)
      toast.error('Could not approve submission')
    } finally {
      setWorking(false)
    }
  }

  const reject = async (submission: SkillSubmission) => {
    setWorking(true)
    const { error } = await supabase
      .from('skill_submissions')
      .update({
        status: 'rejected',
        reviewer_notes: reviewerNotes || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission.id)
    setWorking(false)
    if (error) {
      toast.error('Could not reject submission')
      return
    }
    toast.success('Submission rejected')
    window.location.reload()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-h2 text-brand-black">Skill submissions</h1>
      </div>

      <div className="space-y-3">
        {submissions.map(submission => (
          <div key={submission.id} className="bg-white border border-brand-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-cream/50 transition-colors" onClick={() => setSelected(selected?.id === submission.id ? null : submission)}>
              <div className="flex-1 min-w-0">
                <div className="font-[700] text-body text-brand-black truncate">{submission.title}</div>
                <div className="text-caption text-brand-gray font-[600] mt-0.5">
                  {submission.submission_type.toUpperCase()} · {submission.submitter_name} &lt;{submission.submitter_email}&gt;
                </div>
              </div>
              <span className={cn('meta-pill px-2.5 py-1', submission.status === 'pending' && 'bg-[#fff0e6] text-[#a84a00]', submission.status === 'approved' && 'bg-[#e6f4ed] text-[#1a5c35]', submission.status === 'rejected' && 'bg-[#f0f0f0] text-[#444]')}>
                {submission.status}
              </span>
              {selected?.id === submission.id ? <ChevronUp size={16} className="text-brand-gray" /> : <ChevronDown size={16} className="text-brand-gray" />}
            </div>

            {selected?.id === submission.id && (
              <div className="border-t border-brand-border px-5 py-5 space-y-4">
                {submission.short_description && (
                  <div>
                    <div className="type-label mb-1">Description</div>
                    <p className="text-body-sm text-brand-text font-[600]">{submission.short_description}</p>
                  </div>
                )}
                <div>
                  <div className="type-label mb-1">Version info</div>
                  <p className="text-body-sm text-brand-text font-[600]">
                    v{submission.version_number ?? 1}
                    {submission.version_label ? ` · ${submission.version_label}` : ''}
                  </p>
                </div>
                {submission.changelog && (
                  <div>
                    <div className="type-label mb-1">Changelog</div>
                    <p className="text-body-sm text-brand-text font-[600] whitespace-pre-wrap">{submission.changelog}</p>
                  </div>
                )}
                {submission.content_markdown && (
                  <div>
                    <div className="type-label mb-1.5">Content</div>
                    <pre className="bg-cream border border-brand-border rounded-lg p-4 text-body-sm text-brand-text whitespace-pre-wrap font-sans font-[600] leading-relaxed max-h-64 overflow-y-auto">
                      {submission.content_markdown}
                    </pre>
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div>
                    <FormLabel htmlFor="skill-reviewer-notes">Reviewer notes (optional)</FormLabel>
                    <Textarea
                      id="skill-reviewer-notes"
                      value={reviewerNotes}
                      onChange={e => setReviewerNotes(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {submission.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reject(submission)}
                      disabled={working}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <X size={13} />
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => approve(submission)} disabled={working}>
                      <Check size={13} />
                      Approve & publish
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
