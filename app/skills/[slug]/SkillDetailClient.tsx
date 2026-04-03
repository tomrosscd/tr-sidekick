'use client'

import Link from 'next/link'
import { ArrowLeft, Download, User, Calendar } from 'lucide-react'
import { Header } from '@/components/Header'
import { formatDate } from '@/lib/utils'
import type { Skill, SkillFile, SkillVersion } from '@/types'

interface SkillDetailClientProps {
  skill: Skill
  currentVersion: SkillVersion | null
  versions: SkillVersion[]
  filesByVersion: Record<string, SkillFile[]>
  signedFileUrls: Record<string, string>
}

export function SkillDetailClient({
  skill,
  currentVersion,
  versions,
  filesByVersion,
  signedFileUrls,
}: SkillDetailClientProps) {
  return (
    <>
      <Header showTimeframe={false} />
      <main className="max-w-4xl mx-auto px-5 py-8 pb-20">
        <div className="mb-8">
          <Link href="/skills" className="inline-flex items-center gap-1.5 text-body-sm font-[700] text-brand-gray hover:text-dg transition-colors">
            <ArrowLeft size={13} />
            Back to skills library
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span
              className="meta-pill"
              style={{ background: 'var(--library-chip-bg)', color: 'var(--library-chip-fg)' }}
            >
              {skill.category}
            </span>
            {currentVersion && (
              <span
                className="meta-pill"
                style={{ background: 'var(--library-surface-muted)', color: 'var(--shell-fg)' }}
              >
                v{currentVersion.version_number}{currentVersion.version_label ? ` · ${currentVersion.version_label}` : ''}
              </span>
            )}
          </div>

          <h1 className="font-serif text-h1 leading-[1.08] text-[var(--shell-fg)] mb-3">
            {skill.title}
          </h1>
          {skill.short_description && (
            <p className="text-body text-[var(--shell-muted-fg)] font-[500] leading-relaxed max-w-3xl">
              {skill.short_description}
            </p>
          )}
        </div>

        <div
          className="mb-8 rounded-xl p-6 shadow-card-soft border"
          style={{
            background: 'var(--library-surface)',
            borderColor: 'var(--card-border)',
          }}
        >
          <h2 className="type-label mb-3" style={{ color: 'var(--shell-muted-fg)' }}>
            Current version notes
          </h2>
          {currentVersion?.changelog ? (
            <p className="text-body-sm text-brand-text font-[500] whitespace-pre-wrap">
              {currentVersion.changelog}
            </p>
          ) : (
            <p className="text-body-sm text-[var(--shell-muted-fg)] font-[500]">No changelog provided for this version.</p>
          )}
        </div>

        <div className="mb-10">
          <h2 className="type-label mb-3" style={{ color: 'var(--shell-muted-fg)' }}>
            Version history
          </h2>
          <div className="space-y-3">
            {versions.map(version => (
              <div key={version.id} className="surface-card p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="font-serif text-h3 text-[var(--shell-fg)]">
                    v{version.version_number}
                    {version.version_label ? ` · ${version.version_label}` : ''}
                  </div>
                  <div className="text-caption text-[var(--shell-muted-fg)] font-[500] flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><User size={12} /> {skill.owner_name ?? 'Unknown owner'}</span>
                    <span className="inline-flex items-center gap-1"><Calendar size={12} /> {formatDate(version.created_at)}</span>
                  </div>
                </div>

                {version.changelog && (
                  <p className="text-body-sm text-brand-text font-[500] whitespace-pre-wrap mb-3">
                    {version.changelog}
                  </p>
                )}

                {(filesByVersion[version.id] ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(filesByVersion[version.id] ?? []).map(file => (
                      <a
                        key={file.id}
                        href={signedFileUrls[file.id]}
                        className="inline-flex items-center gap-1.5 text-caption font-[600] px-3 py-1.5 rounded-md border transition-colors hover:border-[var(--library-accent)] hover:text-[var(--shell-fg)]"
                        style={{
                          borderColor: 'var(--card-border)',
                          background: 'var(--library-surface)',
                          color: 'var(--shell-muted-fg)',
                        }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download size={12} />
                        {file.file_name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
