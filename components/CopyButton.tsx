'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn, copyToClipboard, buildPrompt } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'
import { useTimeframe } from './TimeframeContext'
import type { Prompt } from '@/types'

interface CopyButtonProps {
  prompt: Pick<Prompt, 'id' | 'prompt_body' | 'slug' | 'category' | 'level' | 'visibility'>
  className?: string
  size?: 'sm' | 'default'
}

export function CopyButton({ prompt, className, size = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { state } = useTimeframe()

  const handleCopy = async () => {
    const text = buildPrompt(prompt.prompt_body, state)
    const ok = await copyToClipboard(text)

    if (ok) {
      setCopied(true)
      toast.success('Copied to clipboard', {
        icon: (
          <Check size={14} />
        ),
      })
      setTimeout(() => setCopied(false), 2000)

      trackEvent('prompt_copy', {
        promptId: prompt.id,
        promptSlug: prompt.slug,
        category: prompt.category,
        level: prompt.level,
        visibility: prompt.visibility,
      })
    } else {
      toast.error('Failed to copy')
    }
  }

  if (size === 'sm') {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 px-3 rounded-md text-caption font-[700] transition-colors',
          copied
            ? 'bg-fg text-white'
            : 'bg-dg text-white hover:bg-fg',
          className
        )}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 px-3.5 rounded-lg text-body-sm font-[700] transition-colors',
        copied
          ? 'bg-fg text-white'
          : 'bg-dg text-white hover:bg-fg',
        className
      )}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

// Full-width variant for detail page
export function CopyButtonFull({ prompt, className }: Omit<CopyButtonProps, 'size'>) {
  const [copied, setCopied] = useState(false)
  const { state } = useTimeframe()

  const handleCopy = async () => {
    const text = buildPrompt(prompt.prompt_body, state)
    const ok = await copyToClipboard(text)

    if (ok) {
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)

      trackEvent('prompt_copy', {
        promptId: prompt.id,
        promptSlug: prompt.slug,
        category: prompt.category,
        level: prompt.level,
        visibility: prompt.visibility,
      })
    } else {
      toast.error('Failed to copy')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex h-12 items-center justify-center gap-2 w-full px-5 rounded-lg text-body-sm font-[800] transition-colors',
        copied
          ? 'bg-fg text-white'
          : 'bg-dg text-white hover:bg-fg',
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied to clipboard!' : 'Copy prompt'}
    </button>
  )
}
