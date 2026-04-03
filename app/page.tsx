import { Suspense } from 'react'
import { PromptLibrary } from '@/components/PromptLibrary'

export default function HomePage() {
  return (
    <Suspense>
      <PromptLibrary />
    </Suspense>
  )
}
