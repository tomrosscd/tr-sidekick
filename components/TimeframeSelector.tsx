'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
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
        <span className="ctl-lbl type-label opacity-90" style={{ color: 'var(--tf-label)' }}>
          Timeframe
        </span>
        <div className="flex flex-wrap gap-1">
          {TIMEFRAME_PRESETS.map(preset => (
            <button
              key={preset.value}
              onClick={() => setPreset(preset.value)}
              className={cn(
                'h-9 px-3 rounded-md text-caption font-[700] transition-all whitespace-nowrap border',
                'bg-[var(--tf-ctl-bg)] border-[var(--tf-ctl-border)] text-[var(--tf-ctl-fg)]',
                'hover:bg-[var(--tf-ctl-hover-bg)]',
                state.timeframe === preset.value &&
                  !customVisible &&
                  '!bg-[var(--tf-ctl-active-bg)] !border-[var(--tf-ctl-active-border)] !text-[var(--tf-ctl-active-fg)]'
              )}
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={toggleCustom}
            className={cn(
              'h-9 px-3 rounded-md text-caption font-[700] transition-all whitespace-nowrap border',
              'bg-[var(--tf-ctl-bg)] border-[var(--tf-ctl-border)] text-[var(--tf-ctl-fg)]',
              'hover:bg-[var(--tf-ctl-hover-bg)]',
              customVisible &&
                '!bg-[var(--tf-ctl-active-bg)] !border-[var(--tf-ctl-active-border)] !text-[var(--tf-ctl-active-fg)]'
            )}
          >
            Custom…
          </button>
        </div>
        {customVisible && (
          <input
            className="mt-1 h-9 border rounded-md px-3 text-caption w-56 focus:outline-none focus:ring-2 focus:ring-[var(--filter-input-focus-ring)]/25 transition-colors placeholder:text-[var(--tf-custom-placeholder)]"
            style={{
              background: 'var(--tf-ctl-bg)',
              borderColor: 'var(--tf-ctl-border)',
              color: 'var(--tf-ctl-fg)',
            }}
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
        <span className="type-label opacity-90" style={{ color: 'var(--tf-label)' }}>
          Compare to
        </span>
        <div className="relative inline-flex min-w-[210px]">
          <select
            value={state.comparison}
            onChange={e => setCmp(e.target.value as 'prev' | 'yoy' | 'none')}
            className="h-9 w-full min-w-[210px] rounded-md pl-3 pr-9 text-caption font-[800] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--filter-input-focus-ring)]/25 border"
            style={{
              backgroundColor: 'var(--tf-select-bg)',
              borderColor: 'var(--tf-select-border)',
              color: 'var(--tf-select-fg)',
            }}
          >
            {COMPARISON_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} style={{ color: 'var(--tf-select-fg)', background: 'var(--tf-select-bg)' }}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 opacity-70"
            style={{ color: 'var(--tf-select-chevron)' }}
            aria-hidden
          />
        </div>
      </div>

      {/* Preview pill */}
      <div
        className="flex min-h-9 items-center gap-1.5 flex-wrap rounded-md px-3 py-1.5 text-caption font-[800] self-end whitespace-nowrap border"
        style={{
          background: 'var(--tf-preview-bg)',
          borderColor: 'var(--tf-ctl-border)',
          color: 'var(--tf-preview-fg)',
        }}
      >
        <span>{preview.tf}</span>
        {preview.cmp && (
          <>
            <span className="text-label font-[700]" style={{ color: 'var(--tf-preview-muted)' }}>
              vs
            </span>
            <span>{preview.cmp}</span>
          </>
        )}
      </div>
    </div>
  )
}
