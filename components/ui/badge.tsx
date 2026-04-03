import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-1 text-label uppercase transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-dg text-white',
        secondary:
          'border-transparent bg-lg text-dg',
        outline:
          'border-brand-border text-brand-gray bg-transparent',
        featured:
          'border-transparent bg-[rgba(73,158,107,0.15)] text-fg border-[rgba(73,158,107,0.3)]',
        recommended:
          'border-transparent bg-[rgba(201,222,182,0.4)] text-[#1a5c35] border-[rgba(201,222,182,0.6)]',
        new:
          'border-transparent bg-[rgba(255,163,102,0.15)] text-[#a84a00] border-[rgba(255,163,102,0.4)]',
        needsFilling:
          'border-transparent bg-[rgba(255,163,102,0.15)] text-[#a84a00] border-[rgba(255,163,102,0.4)]',
        draft:
          'border-transparent bg-[rgba(122,138,132,0.15)] text-brand-gray border-[rgba(122,138,132,0.3)]',
        internal:
          'border-transparent bg-[rgba(39,56,47,0.1)] text-dg border-[rgba(39,56,47,0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
