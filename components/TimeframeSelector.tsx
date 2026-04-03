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
    <div className="hdr-controls flex flex-wrap gap-x-5 gap-y-2.5 px-5 py-3 items-end">
      {/* Timeframe */}
      <div className="flex flex-col gap-1.5">
        <span className="ctl-lbl text-[9px] font-[800] tracking-[0.14em] uppercase text-lg opacity-60">
          Timeframe
        </span>
        <div className="flex flex-wrap gap-1">
          {TIMEFRAME_PRESETS.map(preset => (
            <button
              key={preset.value}
              onClick={() => setPreset(preset.value)}
              className={cn(
                'px-2.5 py-[5px] rounded-[5px] text-[12px] font-[600] transition-all whitespace-nowrap border',
                'bg-white/7 border-white/13 text-white/60 hover:bg-white/13 hover:text-white',
                state.timeframe === preset.value &&
                  !customVisible &&
                  'bg-fg border-fg text-white'
              )}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={toggleCustom}
            className={cn(
              'px-2.5 py-[5px] rounded-[5px] text-[12px] font-[600] transition-all whitespace-nowrap border',
              'bg-white/7 border-white/13 text-white/60 hover:bg-white/13 hover:text-white',
              customVisible && 'bg-fg border-fg text-white'
            )}
          >
            Custom…
          </button>
        </div>
        {customVisible && (
          <input
            className="mt-1 bg-white/7 border border-white/20 text-white placeholder:text-white/30 rounded-[5px] px-2.5 py-[5px] text-[12px] w-52 focus:outline-none focus:border-fg transition-colors"
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
        <span className="text-[9px] font-[800] tracking-[0.14em] uppercase text-lg opacity-60">
          Compare to
        </span>
        <select
          value={state.comparison}
          onChange={e => setCmp(e.target.value as 'prev' | 'yoy' | 'none')}
          className="bg-white/8 border border-white/18 text-white rounded-[5px] px-2.5 py-[6px] text-[12px] font-[600] appearance-none pr-7 focus:outline-none focus:border-fg"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,.4)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 9px center',
          }}
        >
          {COMPARISON_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: '#27382f' }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Preview pill */}
      <div className="flex items-center gap-1.5 flex-wrap bg-lg/12 border border-lg/22 rounded-[6px] px-3 py-[6px] text-[12px] font-[700] text-lg self-end whitespace-nowrap">
        <span>{preview.tf}</span>
        {preview.cmp && (
          <>
            <span className="opacity-45 text-[10px] font-[500]">vs</span>
            <span>{preview.cmp}</span>
          </>
        )}
      </div>
    </div>
  )
}
