'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getTimeframePreviewText } from '@/lib/utils'
import { useTimeframe } from './TimeframeContext'
import { TIMEFRAME_PRESETS, COMPARISON_OPTIONS } from '@/types'

export function TimeframeSelector() {
  const { state, setState } = useTimeframe()
  const [customVisible, setCustomVisible] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const setPreset = (value: string) => {
    setCustomVisible(false)
    setCustomValue('')
    setState(prev => ({ ...prev, timeframe: value }))
  }

  const toggleCustom = () => {
    setCustomVisible(v => !v)
  }

  const applyCustom = (val: string) => {
    if (val.trim()) {
      setState(prev => ({ ...prev, timeframe: val.trim() }))
    }
  }

  const setCmp = (value: 'prev' | 'yoy' | 'none') => {
    setState(prev => ({ ...prev, comparison: value }))
  }

  const preview = getTimeframePreviewText(state)

  return (
    <div className="hdr-controls flex flex-wrap gap-x-6 gap-y-3 px-5 py-3.5 items-end">
      {/* Timeframe */}
      <div className="flex flex-col gap-1.5">
        <span className="ctl-lbl type-label text-lg/70 opacity-75">
          Timeframe
        </span>
        <div className="flex flex-wrap gap-1">
          {TIMEFRAME_PRESETS.map(preset => (
            <button
              key={preset.value}
              onClick={() => setPreset(preset.value)}
              className={cn(
                'h-9 px-3 rounded-md text-caption font-[700] transition-all whitespace-nowrap border',
                'bg-white/8 border-white/40 text-white/80 hover:bg-white/14 hover:text-white hover:border-white/55',
                state.timeframe === preset.value &&
                  !customVisible &&
                  'bg-fg border-white text-white'
              )}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={toggleCustom}
            className={cn(
              'h-9 px-3 rounded-md text-caption font-[700] transition-all whitespace-nowrap border',
              'bg-white/8 border-white/40 text-white/80 hover:bg-white/14 hover:text-white hover:border-white/55',
              customVisible && 'bg-fg border-white text-white'
            )}
          >
            Custom…
          </button>
        </div>
        {customVisible && (
          <input
            className="mt-1 h-9 bg-white/8 border border-white/40 text-white placeholder:text-white/45 rounded-md px-3 text-caption w-56 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 transition-colors"
            placeholder="e.g. 1 Jan – 31 Mar 2025"
            value={customValue}
            onChange={e => {
              setCustomValue(e.target.value)
              applyCustom(e.target.value)
            }}
          />
        )}
      </div>

      {/* Compare to */}
      <div className="flex flex-col gap-1.5">
        <span className="type-label text-lg/70 opacity-75">
          Compare to
        </span>
        <select
          value={state.comparison}
          onChange={e => setCmp(e.target.value as 'prev' | 'yoy' | 'none')}
          className="h-9 min-w-[210px] bg-white border border-white text-dg rounded-md px-3 text-caption font-[800] appearance-none pr-8 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(39,56,47,.75)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 9px center',
          }}
        >
          {COMPARISON_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} style={{ color: '#27382f', background: '#ffffff' }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Preview pill */}
      <div className="flex min-h-9 items-center gap-1.5 flex-wrap bg-white/10 border border-white/40 rounded-md px-3 py-1.5 text-caption font-[800] text-white self-end whitespace-nowrap">
        <span>{preview.tf}</span>
        {preview.cmp && (
          <>
            <span className="opacity-55 text-label font-[700]">vs</span>
            <span>{preview.cmp}</span>
          </>
        )}
      </div>
    </div>
  )
}
