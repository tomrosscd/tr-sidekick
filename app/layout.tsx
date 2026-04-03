import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { LibraryThemeSync } from '@/components/LibraryThemeSync'
import { ShellFooter } from '@/components/ShellFooter'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sidekick Prompt Library — Convert Digital',
  description:
    'A curated library of ecommerce analysis prompts for Shopify. Find, copy, and share prompts for CRO, LTV, BFCM, strategy, and more.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="en" data-library="sidekick" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <LibraryThemeSync />
        {children}
        <ShellFooter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#27382f',
              color: '#fff',
              border: 'none',
              fontFamily: "'Darker Grotesque', system-ui, sans-serif",
              fontWeight: '700',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
