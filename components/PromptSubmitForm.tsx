'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLabel } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CATEGORIES, USE_CASE_OPTIONS, USE_CASE_LABELS } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'

export function PromptSubmitForm() {
  const router = useRouter()
  const supabase = createClient()
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '',
    short_description: '',
    prompt_body: '',
    category: '',
    use_cases: [] as string[],
    data_sources: '',
    when_to_use: '',
    caveats: '',
    notes: '',
    submitter_name: '',
    submitter_email: '',
  })

  const update = (key: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const toggleUseCase = (uc: string) => {
    const current = form.use_cases
    const next = current.includes(uc)
      ? current.filter(u => u !== uc)
      : [...current, uc]
    update('use_cases', next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.prompt_body || !form.category) {
      toast.error('Please fill in the required fields (title, prompt body, category)')
      return
    }

    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    const submission = {
      submitted_by: user?.id ?? null,
      submitter_name: form.submitter_name || user?.email?.split('@')[0] ?? 'Anonymous',
      submitter_email: form.submitter_email || user?.email ?? '',
      title: form.title,
      short_description: form.short_description,
      prompt_body: form.prompt_body,
      category: form.category,
      use_cases: form.use_cases,
      data_sources: form.data_sources ? form.data_sources.split(',').map(s => s.trim()).filter(Boolean) : [],
      notes: form.notes || null,
      status: 'pending' as const,
    }

    const { error } = await supabase
      .from('prompt_submissions')
      .insert(submission)

    setSubmitting(false)

    if (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
      return
    }

    // Send notification via API route
    try {
      await fetch('/api/submit-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
    } catch {
      // Notification failure shouldn't block the user
    }

    trackEvent('prompt_submit', { category: form.category })
    toast.success('Prompt submitted for review!')
    router.push('/')
  }

  const categoryOptions = CATEGORIES.filter(c => c.value !== 'All')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Submitter info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="submitter_name">Your name</FormLabel>
          <Input
            id="submitter_name"
            placeholder="Tom Ross"
            value={form.submitter_name}
            onChange={e => update('submitter_name', e.target.value)}
          />
        </div>
        <div>
          <FormLabel htmlFor="submitter_email">Your email</FormLabel>
          <Input
            id="submitter_email"
            type="email"
            placeholder="tom@convertdigital.com.au"
            value={form.submitter_email}
            onChange={e => update('submitter_email', e.target.value)}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <FormLabel htmlFor="title">
          Prompt title <span className="text-red-500">*</span>
        </FormLabel>
        <Input
          id="title"
          placeholder="e.g. Executive Performance Summary"
          value={form.title}
          onChange={e => update('title', e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <FormLabel htmlFor="short_description">Short description</FormLabel>
        <Input
          id="short_description"
          placeholder="One-line summary of what this prompt does"
          value={form.short_description}
          onChange={e => update('short_description', e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <FormLabel>
          Category <span className="text-red-500">*</span>
        </FormLabel>
        <Select value={form.category} onValueChange={v => update('category', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category…" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prompt body */}
      <div>
        <FormLabel htmlFor="prompt_body">
          Prompt body <span className="text-red-500">*</span>
        </FormLabel>
        <p className="text-[11.5px] text-brand-gray mb-2">
          Use <code className="bg-brand-border/40 px-1 rounded">{'{{TF}}'}</code> for timeframe and{' '}
          <code className="bg-brand-border/40 px-1 rounded">{'{{CMP}}'}</code> for comparison period.
          Use <code className="bg-brand-border/40 px-1 rounded">[Placeholder]</code> for user-editable values.
        </p>
        <Textarea
          id="prompt_body"
          placeholder="Act as my Shopify analyst…"
          className="min-h-[240px] font-mono text-[12px]"
          value={form.prompt_body}
          onChange={e => update('prompt_body', e.target.value)}
          required
        />
      </div>

      {/* When to use */}
      <div>
        <FormLabel htmlFor="when_to_use">When this prompt is useful</FormLabel>
        <Textarea
          id="when_to_use"
          placeholder="Describe the scenarios where this prompt is most useful…"
          className="min-h-[80px]"
          value={form.when_to_use}
          onChange={e => update('when_to_use', e.target.value)}
        />
      </div>

      {/* Use cases */}
      <div>
        <FormLabel>Use cases</FormLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {USE_CASE_OPTIONS.map(uc => (
            <label
              key={uc}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <Checkbox
                checked={form.use_cases.includes(uc)}
                onCheckedChange={() => toggleUseCase(uc)}
              />
              <span className="text-[12px] font-[600] text-brand-gray group-hover:text-dg transition-colors">
                {USE_CASE_LABELS[uc]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <div>
        <FormLabel htmlFor="data_sources">Data sources</FormLabel>
        <Input
          id="data_sources"
          placeholder="Shopify Analytics, GA4, Klaviyo (comma-separated)"
          value={form.data_sources}
          onChange={e => update('data_sources', e.target.value)}
        />
      </div>

      {/* Caveats */}
      <div>
        <FormLabel htmlFor="caveats">Caveats / notes</FormLabel>
        <Textarea
          id="caveats"
          placeholder="Any important limitations, prerequisites, or notes for reviewers…"
          className="min-h-[80px]"
          value={form.caveats}
          onChange={e => update('caveats', e.target.value)}
        />
      </div>

      {/* Notes to reviewer */}
      <div>
        <FormLabel htmlFor="notes">Notes to reviewer</FormLabel>
        <Textarea
          id="notes"
          placeholder="Anything the reviewer should know about this submission…"
          className="min-h-[80px]"
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit for review'}
        </Button>
      </div>
    </form>
  )
}
