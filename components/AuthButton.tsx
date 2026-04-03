'use client'

import { useEffect, useState } from 'react'
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react'
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

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

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
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="inline-flex h-10 items-center gap-1.5 px-3.5 rounded-lg text-caption font-[700] bg-white/10 text-white/85 hover:bg-white/20 hover:text-white transition-colors border border-white/15"
      >
        <LogIn size={13} />
        Sign in
      </button>
    )
  }

  const initials = user.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'U'

  const isInternal = isInternalUser(user.email)
  const isAdmin = isAdminUser(user.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 items-center gap-2 rounded-lg px-2.5 hover:bg-white/10 transition-colors focus:outline-none">
          <div className="w-8 h-8 rounded-full bg-lg/30 border border-lg/40 flex items-center justify-center text-caption font-[800] text-lg">
            {initials}
          </div>
          <ChevronDown size={12} className="text-white/60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="normal-case text-[12px] font-[600] text-brand-black tracking-normal opacity-100">
          <div className="font-[700] text-brand-black truncate">{user.email}</div>
          <div className="text-[11px] text-brand-gray font-[500] mt-0.5">
            {isAdmin ? 'Admin' : isInternal ? 'Internal' : 'External'}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isInternal && (
          <DropdownMenuItem asChild>
            <Link href="/submit" className="cursor-pointer">
              Submit a prompt
            </Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              Admin area
            </Link>
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
