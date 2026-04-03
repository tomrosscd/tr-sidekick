'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, isInternalUser } from '@/lib/utils'

export function LibrarySwitcher() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setVisible(isInternalUser(data.user?.email))
    })
    return () => {
      mounted = false
    }
  }, [supabase.auth])

  const items = useMemo(
    () => [
      { href: '/', label: 'Sidekick Prompt Library', active: pathname === '/' || pathname.startsWith('/prompts') || pathname.startsWith('/collections') || pathname.startsWith('/submit') },
      { href: '/skills', label: 'Claude Skills Library', active: pathname.startsWith('/skills') },
    ],
    [pathname]
  )

  if (!visible) return null

  return (
    <div className="flex items-center rounded-lg border border-white/18 bg-white/8 p-1">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'rounded-md px-2.5 py-1.5 text-label font-[700] tracking-[0.06em] uppercase text-white/80 transition-colors',
            item.active ? 'bg-white text-dg' : 'hover:text-white hover:bg-white/10'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
