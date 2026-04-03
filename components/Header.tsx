'use client'

import { useState } from 'react'
import { AuthButton } from './AuthButton'
import { TimeframeSelector } from './TimeframeSelector'
import Link from 'next/link'

interface HeaderProps {
  showTimeframe?: boolean
}

export function Header({ showTimeframe = true }: HeaderProps) {
  const [sidekickLogoFailed, setSidekickLogoFailed] = useState(false)
  const [convertLogoFailed, setConvertLogoFailed] = useState(false)

  return (
    <div
      id="hdr"
      className="bg-dg sticky top-0 z-[300] border-b border-white/[0.06]"
    >
      {/* Top bar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-3.5 border-b border-white/[0.07] gap-3 min-h-[70px]">
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg whitespace-nowrap justify-self-start min-w-0">
          {!sidekickLogoFailed ? (
            <img
              src="/logos/sidekick_logo.svg"
              alt="Sidekick"
              className="h-8 w-8 object-contain shrink-0"
              onError={() => setSidekickLogoFailed(true)}
            />
          ) : (
            <span className="h-8 w-8 rounded-lg bg-white/14 border border-white/25" aria-hidden />
          )}
          <span className="text-caption sm:text-body-sm font-[800] uppercase tracking-[0.08em] text-lg/90 truncate">
            Sidekick Prompt Library
          </span>
        </Link>
        <div className="justify-self-center">
          {!convertLogoFailed ? (
            <img
              src="/logos/Convert_Logo_White.svg"
              alt="Convert"
              className="h-7 w-auto object-contain"
              onError={() => setConvertLogoFailed(true)}
            />
          ) : (
            <span className="font-serif text-h3 text-white">Convert</span>
          )}
        </div>
        <div className="justify-self-end flex items-center">
          <AuthButton />
        </div>
      </div>

      {/* Timeframe controls */}
      {showTimeframe && <TimeframeSelector />}
    </div>
  )
}
