'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getLibraryTheme(pathname: string): 'sidekick' | 'claude' {
  return pathname.startsWith('/skills') ? 'claude' : 'sidekick'
}

export function LibraryThemeSync() {
  const pathname = usePathname()

  useEffect(() => {
    const theme = getLibraryTheme(pathname)
    document.documentElement.setAttribute('data-library', theme)
  }, [pathname])

  return null
}
