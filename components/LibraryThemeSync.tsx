'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isInternalUser } from '@/lib/utils'

export type LibraryTheme = 'convert' | 'sidekick' | 'claude'

/**
 * Resolve which style system should be active.
 *
 * Section → system mapping:
 *   /admin/*          → convert   (admin always Convert)
 *   /login            → convert   (public page)
 *   /skills/* + auth  → claude    (Claude Skills library)
 *   /*       + auth   → sidekick  (logged-in prompt library)
 *   /*       + public → convert   (signed-out / public default)
 */
export function resolveLibraryTheme(pathname: string, internal: boolean): LibraryTheme {
  if (pathname.startsWith('/admin') || pathname.startsWith('/login')) {
    return 'convert'
  }
  if (!internal) {
    return 'convert'
  }
  if (pathname.startsWith('/skills')) {
    return 'claude'
  }
  return 'sidekick'
}

export function LibraryThemeSync() {
  const pathname = usePathname()
  const [internal, setInternal] = useState(false)

  // Detect auth state once on mount; track sign-in/out changes
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setInternal(isInternalUser(data.user?.email))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setInternal(isInternalUser(session?.user?.email))
    })

    return () => subscription.unsubscribe()
  }, [])

  // Update html[data-library] whenever path or auth state changes
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-library',
      resolveLibraryTheme(pathname, internal)
    )
  }, [pathname, internal])

  return null
}
