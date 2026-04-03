import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TimeframeState } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Timeframe helpers ────────────────────────────────────────────────────────

const COMPARISON_MAP: Record<string, string> = {
  'last 7 days': 'the previous 7 days',
  'last 14 days': 'the previous 14 days',
  'last 30 days': 'the previous 30 days',
  'last 60 days': 'the previous 60 days',
  'last 90 days': 'the previous 90 days',
  'last quarter': 'the previous quarter',
  'last 6 months': 'the previous 6 months',
  'last 12 months': 'the previous 12 months',
}

export function getCmpText(state: TimeframeState): string | null {
  if (state.comparison === 'none') return null
  if (state.comparison === 'yoy') return 'the same period last year'
  return COMPARISON_MAP[state.timeframe] ?? 'the previous comparable period'
}

export function buildPrompt(promptBody: string, state: TimeframeState): string {
  const tf = 'the ' + state.timeframe
  const cmp = getCmpText(state)

  let text = promptBody.replace(/\{\{TF\}\}/g, tf)

  if (cmp) {
    text = text.replace(/\{\{CMP\}\}/g, cmp)
  } else {
    text = text
      .replace(/, compared to \{\{CMP\}\}/gi, '')
      .replace(/ and compare it to \{\{CMP\}\}/gi, '')
      .replace(/ compared to \{\{CMP\}\}/gi, '')
      .replace(/\{\{CMP\}\}/g, 'the previous comparable period')
  }

  return text
}

export function getTimeframePreviewText(state: TimeframeState): { tf: string; cmp: string | null } {
  return {
    tf: 'the ' + state.timeframe,
    cmp: getCmpText(state),
  }
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ?? 'convertdigital.com.au'
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'tom@convertdigital.com.au'

export function isInternalUser(email: string | undefined | null): boolean {
  if (!email) return false
  return email.endsWith(`@${ALLOWED_DOMAIN}`)
}

export function isAdminUser(email: string | undefined | null): boolean {
  if (!email) return false
  return email === ADMIN_EMAIL
}

// ─── Prompt placeholders ──────────────────────────────────────────────────────

export function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\[[^\]]+\]/g) ?? []
  return [...new Set(matches)]
}

export function hasManualPlaceholders(text: string): boolean {
  return /\[[^\]]+\]/.test(text)
}

// ─── Copy to clipboard ────────────────────────────────────────────────────────

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to legacy
    }
  }
  // Legacy fallback
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    document.execCommand('copy')
    return true
  } catch {
    return false
  } finally {
    document.body.removeChild(ta)
  }
}

// ─── Session ID ───────────────────────────────────────────────────────────────

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = 'sk_session'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(key, id)
  }
  return id
}

// ─── Format date ─────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Truncate ─────────────────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
