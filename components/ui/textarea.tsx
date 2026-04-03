import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[96px] w-full rounded-lg border border-brand-border bg-white px-3.5 py-2.5 text-body-sm text-brand-black placeholder:text-brand-gray transition-all resize-y',
          'focus:outline-none focus:border-fg focus:ring-2 focus:ring-fg/20 focus:ring-offset-2 focus:ring-offset-cream',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
