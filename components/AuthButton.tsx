'use client'

import { useEffect, useState } from 'react'
import { LogIn, LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { isAdminUser, isInternalUser } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { LibraryTheme } from './LibraryThemeSync'

interface AuthButtonProps {
  compact?: boolean
  variant?: LibraryTheme
}

export function AuthButton({ compact = false, variant = 'convert' }: AuthButtonProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Convert and Sidekick both have dark headers; Claude has light
  const headerOnDark = variant !== 'claude'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div
        className={
          compact
            ? headerOnDark
              ? 'h-9 w-[78px] rounded-full bg-white/14 animate-pulse'
              : 'h-9 w-[78px] rounded-full bg-black/[0.06] animate-pulse'
            : 'w-10 h-10 rounded-lg bg-white/10 animate-pulse'
        }
      />
    )
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className={
          compact
            ? headerOnDark
              ? 'inline-flex h-9 items-center gap-1.5 px-3 rounded-full text-caption font-[700] bg-white/10 text-white/90 hover:bg-white/18 transition-colors border border-white/20'
              : 'inline-flex h-9 items-center gap-1.5 px-3 rounded-full text-caption font-[700] bg-[var(--shell-elevated)] text-[var(--shell-fg)] hover:bg-[var(--shell-muted)] transition-colors border border-[var(--shell-border)]'
            : 'inline-flex h-10 items-center gap-1.5 px-3.5 rounded-lg text-caption font-[700] bg-white/10 text-white/85 hover:bg-white/20 hover:text-white transition-colors border border-white/15'
        }
      >
        <LogIn size={13} />
        Sign In
      </button>
    )
  }

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : 'U'
  const isInternal = isInternalUser(user.email)
  const isAdmin = isAdminUser(user.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button
            className={
              headerOnDark
                ? 'inline-flex h-9 items-center gap-1.5 rounded-full px-1.5 pr-2 border border-white/20 bg-white/10 hover:bg-white/18 transition-colors focus:outline-none'
                : 'inline-flex h-9 items-center gap-1.5 rounded-full px-1.5 pr-2 border border-[var(--shell-border)] bg-[var(--shell-elevated)] hover:bg-[var(--shell-muted)] transition-colors focus:outline-none'
            }
          >
            <span
              className={
                headerOnDark
                  ? 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/14 border border-white/25 text-white'
                  : 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--shell-muted)] border border-[var(--shell-border)] text-[var(--shell-fg)]'
              }
            >
              <UserIcon size={11} />
            </span>
            <span
              className={
                headerOnDark
                  ? 'text-caption font-[800] text-white/95'
                  : 'text-caption font-[800] text-[var(--shell-fg)]'
              }
            >
              {initials}
            </span>
            <ChevronDown
              size={12}
              className={headerOnDark ? 'text-white/60' : 'text-[var(--shell-muted-fg)]'}
            />
          </button>
        ) : (
          <button className="flex h-10 items-center gap-2 rounded-lg px-2.5 hover:bg-white/10 transition-colors focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-lg/30 border border-lg/40 flex items-center justify-center text-caption font-[800] text-lg">
              {initials}
            </div>
            <ChevronDown size={12} className="text-white/60" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="normal-case text-caption font-[700] text-brand-black tracking-normal opacity-100">
          <div className="font-[700] text-brand-black truncate">{user.email}</div>
          <div className="text-label text-brand-gray font-[700] mt-0.5">
            {isAdmin ? 'Admin' : isInternal ? 'Internal' : 'External'}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isInternal && (
          <DropdownMenuItem asChild>
            <Link href="/submit" className="cursor-pointer">Submit a prompt</Link>
          </DropdownMenuItem>
        )}
        {isInternal && (
          <DropdownMenuItem asChild>
            <Link href="/skills/submit" className="cursor-pointer">Submit a skill</Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">Admin area</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
          <LogOut size={14} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
