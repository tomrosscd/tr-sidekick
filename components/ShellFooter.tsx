import Link from 'next/link'

export function ShellFooter() {
  return (
    <footer
      data-style-system="convert"
      className="convert-footer mt-14"
    >
      <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <img
            src="/logos/Convert_Logo_Dark Green.svg"
            alt="Convert"
            className="h-5 w-auto object-contain object-left"
          />
          <p className="convert-footer__body max-w-sm">
            Need CRO, analytics, or growth support? Let&apos;s work together.
          </p>
        </div>
        <Link
          href="https://www.convertdigital.com.au/"
          target="_blank"
          rel="noreferrer"
          className="convert-footer__link inline-flex h-9 items-center rounded-full px-4 transition-colors self-start sm:self-auto"
        >
          Visit Convert Digital
        </Link>
      </div>
    </footer>
  )
}
