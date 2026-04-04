'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LibraryTheme } from './LibraryThemeSync'

interface LibraryToggleProps {
  isInternal: boolean
  variant: LibraryTheme
}

function isSidekickRoute(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname.startsWith('/prompts') ||
    pathname.startsWith('/collections') ||
    pathname.startsWith('/submit')
  )
}

interface ToggleIconProps {
  src: string
  alt: string
  active: boolean
  onDarkHeader: boolean
}

function ToggleIcon({ src, alt, active, onDarkHeader }: ToggleIconProps) {
  return (
    <span
      className={cn(
        'h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200',
        active
          ? onDarkHeader
            ? 'bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_3px_8px_rgba(0,0,0,0.18)]'
            : 'bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_2px_6px_rgba(0,0,0,0.08)]'
          : onDarkHeader
            ? 'bg-white/10 hover:bg-white/18'
            : 'bg-[var(--cl-toggle-inactive-bg)] hover:bg-[var(--cl-toggle-inactive-hover)]'
      )}
    >
      <img src={src} alt={alt} className="h-4 w-4 object-contain shrink-0" />
    </span>
  )
}

export function LibraryToggle({ isInternal, variant }: LibraryToggleProps) {
  const pathname = usePathname()
  const sidekickActive = isSidekickRoute(pathname)
  const claudeActive = pathname.startsWith('/skills')

  // Convert and Sidekick have dark headers; Claude has light
  const onDarkHeader = variant !== 'claude'

  const shellClass = cn(
    'inline-flex items-center gap-1 rounded-full p-1 border transition-colors duration-200',
    onDarkHeader
      ? 'border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_10px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.22)]'
      : 'border-[var(--cl-toggle-border)] bg-[var(--cl-toggle-bg)] backdrop-blur-md shadow-glass-pill'
  )

  if (!isInternal) {
    // Non-internal: show icons as display only (no links to Claude Skills)
    return (
      <div className={shellClass} aria-label="Library icons">
        <ToggleIcon src="/logos/sidekick_logo.svg" alt="Sidekick" active onDarkHeader={onDarkHeader} />
        <ToggleIcon src="/logos/Claude_AI_symbol.svg" alt="Claude Skills" active={false} onDarkHeader={onDarkHeader} />
      </div>
    )
  }

  return (
    <div className={shellClass} aria-label="Library switcher">
      <Link href="/" aria-label="Sidekick Prompt Library" className="rounded-full focus-ring">
        <ToggleIcon
          src="/logos/sidekick_logo.svg"
          alt="Sidekick"
          active={sidekickActive}
          onDarkHeader={onDarkHeader}
        />
      </Link>
      <Link href="/skills" aria-label="Claude Skills Library" className="rounded-full focus-ring">
        <ToggleIcon
          src="/logos/Claude_AI_symbol.svg"
          alt="Claude Skills"
          active={claudeActive}
          onDarkHeader={onDarkHeader}
        />
      </Link>
    </div>
  )
}
