'use client'

import type { EventType } from '@/types'

// ─── GA4 ──────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export function trackGA4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

// ─── Internal Supabase events ─────────────────────────────────────────────────

interface TrackEventOptions {
  promptId?: string
  promptSlug?: string
  category?: string
  useCases?: string[]
  dataSources?: string[]
  level?: string
  visibility?: string
  searchTerm?: string
  filterState?: Record<string, unknown>
  userId?: string
  userEmail?: string
}

export async function trackEvent(
  eventType: EventType,
  options: TrackEventOptions = {}
): Promise<void> {
  const { getSessionId } = await import('@/lib/utils')
  const sessionId = getSessionId()

  // GA4 tracking
  trackGA4Event(eventType, {
    prompt_id: options.promptId,
    prompt_slug: options.promptSlug,
    category: options.category,
    use_cases: options.useCases?.join(','),
    data_sources: options.dataSources?.join(','),
    level: options.level,
    visibility: options.visibility,
    search_term: options.searchTerm,
    ...options.filterState,
  })

  // Internal event via API route (fire-and-forget)
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        prompt_id: options.promptId ?? null,
        session_id: sessionId,
        metadata: {
          prompt_slug: options.promptSlug,
          category: options.category,
          use_cases: options.useCases,
          data_sources: options.dataSources,
          level: options.level,
          visibility: options.visibility,
          search_term: options.searchTerm,
          filter_state: options.filterState,
        },
      }),
    })
  } catch {
    // silently fail — analytics should never break the app
  }
}
