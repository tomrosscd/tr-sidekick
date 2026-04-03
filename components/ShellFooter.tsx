import Link from 'next/link'

export function ShellFooter() {
  return (
    <footer
      data-style-system="convert"
      className="convert-footer mt-14"
    >
      <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="convert-footer__title">Built by Convert Digital</p>
          <p className="convert-footer__body mt-1 max-w-md">
            Need CRO, analytics, or growth support? Let’s work together.
          </p>
        </div>
        <Link
          href="https://www.convertdigital.com.au/"
          target="_blank"
          rel="noreferrer"
          className="convert-footer__link inline-flex h-9 items-center rounded-full px-4 transition-colors"
        >
          Visit Convert Digital
        </Link>
      </div>
    </footer>
  )
}
