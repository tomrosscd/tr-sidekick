'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getSkillsBucketName } from '@/lib/skills-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/label'
import type { Skill } from '@/types'
import { SKILL_CATEGORIES, SKILL_USE_CASE_LABELS } from '@/types'

interface SkillSubmitFormProps {
  skills: Pick<Skill, 'id' | 'title' | 'slug'>[]
}

interface SkillSubmitState {
  submission_type: 'new' | 'update'
  skill_id: string
  title: string
  short_description: string
  category: string
  use_cases: string[]
  owner_name: string
  version_number: number
  version_label: string
  changelog: string
  content_markdown: string
  submitter_name: string
  submitter_email: string
}

export function SkillSubmitForm({ skills }: SkillSubmitFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<SkillSubmitState>({
    submission_type: 'new' as 'new' | 'update',
    skill_id: '',
    title: '',
    short_description: '',
    category: SKILL_CATEGORIES[0],
    use_cases: [] as string[],
    owner_name: '',
    version_number: 1,
    version_label: '',
    changelog: '',
    content_markdown: '',
    submitter_name: '',
    submitter_email: '',
  })
  const [files, setFiles] = useState<File[]>([])

  const selectedSkill = useMemo(
    () => skills.find(s => s.id === form.skill_id) ?? null,
    [skills, form.skill_id]
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }

    setSubmitting(true)
    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData.user

      const submissionPayload = {
        submission_type: form.submission_type,
        skill_id: form.submission_type === 'update' ? form.skill_id || null : null,
        submitted_by: user?.id ?? null,
        submitter_name: form.submitter_name || user?.email?.split('@')[0] || 'Anonymous',
        submitter_email: form.submitter_email || user?.email || '',
        title: form.title,
        short_description: form.short_description || null,
        category: form.category,
        use_cases: form.use_cases,
        owner_name: form.owner_name || null,
        version_number: form.version_number,
        version_label: form.version_label || null,
        changelog: form.changelog || null,
        content_markdown: form.content_markdown || null,
        status: 'pending' as const,
      }

      const { data: submission, error: submissionError } = await supabase
        .from('skill_submissions')
        .insert(submissionPayload)
        .select('id')
        .single()

      if (submissionError || !submission) throw submissionError ?? new Error('Submission failed')

      for (const file of files) {
        const uploadInit = await fetch('/api/skills/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillTitle: selectedSkill?.title ?? form.title,
            versionNumber: form.version_number,
            fileName: file.name,
          }),
        })

        const uploadMeta = await uploadInit.json()
        if (!uploadInit.ok) {
          throw new Error(uploadMeta.error ?? 'Failed to initialize file upload')
        }

        const { error: uploadError } = await supabase
          .storage
          .from(getSkillsBucketName())
          .uploadToSignedUrl(uploadMeta.path, uploadMeta.token, file)

        if (uploadError) throw uploadError

        const { error: fileRowError } = await supabase
          .from('skill_files')
          .insert({
            submission_id: submission.id,
            skill_id: form.submission_type === 'update' ? form.skill_id : null,
            file_name: file.name,
            storage_path: uploadMeta.path,
            mime_type: file.type || null,
            file_size_bytes: file.size,
            uploaded_by: user?.id ?? null,
          })

        if (fileRowError) throw fileRowError
      }

      toast.success('Skill submission sent for review')
      router.push('/skills')
    } catch (err) {
      console.error(err)
      toast.error('Could not submit skill')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel>Submission type</FormLabel>
          <div className="flex gap-2">
            <Button type="button" variant={form.submission_type === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setForm(prev => ({ ...prev, submission_type: 'new', skill_id: '' }))}>
              New skill
            </Button>
            <Button type="button" variant={form.submission_type === 'update' ? 'default' : 'outline'} size="sm" onClick={() => setForm(prev => ({ ...prev, submission_type: 'update' }))}>
              Update skill
            </Button>
          </div>
        </div>
        {form.submission_type === 'update' && (
          <div>
            <FormLabel htmlFor="skill_id">Skill to update</FormLabel>
            <select
              id="skill_id"
              value={form.skill_id}
              onChange={e => {
                const skill = skills.find(s => s.id === e.target.value)
                setForm(prev => ({
                  ...prev,
                  skill_id: e.target.value,
                  title: skill?.title ?? prev.title,
                }))
              }}
              className="h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[700] bg-white w-full"
              required
            >
              <option value="">Select skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} required />
        </div>
        <div>
          <FormLabel htmlFor="category">Category</FormLabel>
          <select
            id="category"
            value={form.category}
            onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            className="h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[700] bg-white w-full"
          >
            {SKILL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FormLabel htmlFor="short_description">Short description</FormLabel>
        <Input id="short_description" value={form.short_description} onChange={e => setForm(prev => ({ ...prev, short_description: e.target.value }))} />
      </div>

      <div>
        <FormLabel>Use cases</FormLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(SKILL_USE_CASE_LABELS).map(([key, label]) => {
            const active = form.use_cases.includes(key)
            return (
              <button
                type="button"
                key={key}
                onClick={() => setForm(prev => ({
                  ...prev,
                  use_cases: active ? prev.use_cases.filter(v => v !== key) : [...prev.use_cases, key],
                }))}
                className={`h-8 px-3 rounded-md text-caption font-[700] border ${active ? 'bg-dg text-white border-dg' : 'bg-white text-brand-gray border-brand-border'}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="version_number">Version number</FormLabel>
          <Input
            id="version_number"
            type="number"
            min={1}
            value={form.version_number}
            onChange={e => setForm(prev => ({ ...prev, version_number: Number(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <FormLabel htmlFor="version_label">Version label (optional)</FormLabel>
          <Input id="version_label" value={form.version_label} onChange={e => setForm(prev => ({ ...prev, version_label: e.target.value }))} />
        </div>
      </div>

      <div>
        <FormLabel htmlFor="changelog">Version notes / changelog</FormLabel>
        <Textarea id="changelog" value={form.changelog} onChange={e => setForm(prev => ({ ...prev, changelog: e.target.value }))} />
      </div>

      <div>
        <FormLabel htmlFor="content_markdown">Skill content (markdown)</FormLabel>
        <Textarea
          id="content_markdown"
          className="min-h-[240px] font-mono text-[13px] leading-relaxed"
          value={form.content_markdown}
          onChange={e => setForm(prev => ({ ...prev, content_markdown: e.target.value }))}
        />
      </div>

      <div>
        <FormLabel htmlFor="files">Skill files (.zip, .md, .txt, .json)</FormLabel>
        <input
          id="files"
          type="file"
          multiple
          accept=".zip,.md,.txt,.json"
          onChange={e => setFiles(Array.from(e.target.files ?? []))}
          className="w-full h-10 border border-brand-border rounded-lg px-3.5 text-body-sm font-[700] bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="submitter_name">Your name</FormLabel>
          <Input id="submitter_name" value={form.submitter_name} onChange={e => setForm(prev => ({ ...prev, submitter_name: e.target.value }))} />
        </div>
        <div>
          <FormLabel htmlFor="submitter_email">Your email</FormLabel>
          <Input id="submitter_email" type="email" value={form.submitter_email} onChange={e => setForm(prev => ({ ...prev, submitter_email: e.target.value }))} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit for review'}
        </Button>
      </div>
    </form>
  )
}
