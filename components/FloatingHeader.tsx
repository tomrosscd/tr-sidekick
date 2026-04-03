'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isInternalUser } from '@/lib/utils'
import { AuthButton } from './AuthButton'
import { LibraryToggle } from './LibraryToggle'

interface FloatingHeaderProps {
  showTimeframe?: boolean
  timeframeControls?: React.ReactNode
}

export function FloatingHeader({
  showTimeframe = true,
  timeframeControls,
}: FloatingHeaderProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [convertLogoFailed, setConvertLogoFailed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data.user ?? null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const isInternal = isInternalUser(user?.email)
  const isSkillsRoute = pathname.startsWith('/skills')
  const libraryVariant: 'sidekick' | 'claude' = isSkillsRoute ? 'claude' : 'sidekick'
  const headerOnDark = libraryVariant === 'sidekick'

  return (
    <header id="hdr" className="sticky top-0 z-[320] border-b border-[var(--shell-border)]">
      <div className="bg-[var(--shell-header-bg)]">
        <div className="px-4 sm:px-5 py-2.5 sm:py-3">
        <div className="mx-auto max-w-[1320px]">
            <div className="grid grid-cols-[auto_1fr_auto] items-center h-[52px] sm:h-[54px] gap-2">
              <div className="justify-self-start min-w-[88px]">
                <LibraryToggle isInternal={isInternal} variant={libraryVariant} />
              </div>

              <div className="justify-self-center">
                <Link href="/" className="inline-flex items-center justify-center">
                  {!convertLogoFailed ? (
                    <img
                      src={headerOnDark ? '/logos/Convert_Logo_White.svg' : '/logos/Convert_Logo_Dark Green.svg'}
                      alt="Convert"
                      className="h-6 sm:h-[26px] w-auto object-contain"
                      onError={() => setConvertLogoFailed(true)}
                    />
                  ) : (
                    <span className={`font-serif text-h3 ${headerOnDark ? 'text-white' : 'text-dg'}`}>
                      Convert
                    </span>
                  )}
                </Link>
              </div>

              <div className="justify-self-end flex items-center gap-2">
                <AuthButton compact variant={libraryVariant} />
              </div>
            </div>
        </div>
        </div>
      </div>

      {showTimeframe && timeframeControls ? (
        <div
          className="border-t border-[var(--timeframe-border)]"
          style={{ background: 'var(--timeframe-strip-bg)' }}
        >
          {timeframeControls}
        </div>
      ) : null}
    </header>
  )
}
