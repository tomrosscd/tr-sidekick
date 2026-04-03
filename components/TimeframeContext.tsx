'use client'

import React, { createContext, useContext, useState } from 'react'
import type { TimeframeState } from '@/types'

interface TimeframeContextValue {
  state: TimeframeState
  setState: React.Dispatch<React.SetStateAction<TimeframeState>>
}

const TimeframeContext = createContext<TimeframeContextValue | null>(null)

export function TimeframeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TimeframeState>({
    timeframe: 'last 30 days',
    comparison: 'prev',
  })

  return (
    <TimeframeContext.Provider value={{ state, setState }}>
      {children}
    </TimeframeContext.Provider>
  )
}

export function useTimeframe(): TimeframeContextValue {
  const ctx = useContext(TimeframeContext)
  if (!ctx) throw new Error('useTimeframe must be used within TimeframeProvider')
  return ctx
}
