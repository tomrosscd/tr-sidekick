'use client'

import { FloatingHeader } from './FloatingHeader'
import { TimeframeSelector } from './TimeframeSelector'

interface HeaderProps {
  showTimeframe?: boolean
}

export function Header({ showTimeframe = true }: HeaderProps) {
  return (
    <FloatingHeader
      showTimeframe={showTimeframe}
      timeframeControls={<TimeframeSelector />}
    />
  )
}
