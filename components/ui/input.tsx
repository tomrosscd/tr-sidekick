import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-brand-border bg-white px-3.5 py-2 text-body-sm text-brand-black placeholder:text-brand-gray transition-all',
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
Input.displayName = 'Input'

export { Input }
