'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const reason = searchParams.get('reason')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/')
    })
  }, [])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const messages: Record<string, string> = {
    'unauthorized': 'You need admin access to view that page.',
    'internal-only': 'That page is only available to Convert Digital team members.',
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-dg border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-5 py-3">
          <span className="font-[900] text-[10px] tracking-[0.2em] uppercase text-lg">
            Convert Digital
          </span>
          <h1 className="font-serif text-[17px] text-white text-center flex-1">
            Sidekick Prompt Library
          </h1>
          <span className="w-[120px]" />
        </div>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="font-serif text-[26px] text-brand-black mb-2">
                Sign in
              </h2>
              <p className="text-[13.5px] text-brand-gray font-[500]">
                Use your Convert Digital Google account to access the library.
              </p>
            </div>

            {reason && messages[reason] && (
              <div className="mb-5 bg-[#fff0e6] border border-[rgba(255,163,102,0.4)] rounded-lg px-4 py-3 text-[12.5px] text-[#a84a00] font-[600]">
                {messages[reason]}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-dg text-white rounded-xl py-3 px-5 text-[14px] font-[700] hover:bg-fg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <p className="mt-6 text-center text-[11.5px] text-brand-gray font-[500]">
              Public prompts are available without sign-in.{' '}
              <a href="/" className="text-fg hover:underline font-[700]">
                Browse the library →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
