'use client'

import { AuthButton } from './AuthButton'
import { TimeframeSelector } from './TimeframeSelector'
import Link from 'next/link'

interface HeaderProps {
  showTimeframe?: boolean
}

export function Header({ showTimeframe = true }: HeaderProps) {
  return (
    <div
      id="hdr"
      className="bg-dg sticky top-0 z-[300] border-b border-white/[0.06]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07] gap-3">
        <Link href="/" className="font-[900] text-[10px] tracking-[0.2em] uppercase text-lg whitespace-nowrap flex-shrink-0">
          Convert Digital
        </Link>
        <h1 className="font-serif text-[17px] text-white text-center flex-1">
          Sidekick Prompt Library
        </h1>
        <div className="flex-shrink-0 flex items-center">
          <AuthButton />
        </div>
      </div>

      {/* Timeframe controls */}
      {showTimeframe && <TimeframeSelector />}
    </div>
  )
}
