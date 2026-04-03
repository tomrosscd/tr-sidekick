import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, Inbox, Star, BookOpen, Wrench, FolderClock } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Quick stats
  const [
    { count: totalPrompts },
    { count: pendingSubmissions },
    { count: featuredPrompts },
    { count: totalCollections },
    { count: totalSkills },
    { count: pendingSkillSubmissions },
  ] = await Promise.all([
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('prompt_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('prompt_collections').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('skill_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  const stats = [
    { label: 'Published prompts', value: totalPrompts ?? 0, icon: FileText, href: '/admin/prompts', color: 'text-dg' },
    { label: 'Pending submissions', value: pendingSubmissions ?? 0, icon: Inbox, href: '/admin/submissions', color: pendingSubmissions ? 'text-[#a84a00]' : 'text-dg' },
    { label: 'Featured prompts', value: featuredPrompts ?? 0, icon: Star, href: '/admin/prompts', color: 'text-dg' },
    { label: 'Collections', value: totalCollections ?? 0, icon: BookOpen, href: '/admin/collections', color: 'text-dg' },
    { label: 'Published skills', value: totalSkills ?? 0, icon: Wrench, href: '/admin/skills', color: 'text-dg' },
    { label: 'Pending skill submissions', value: pendingSkillSubmissions ?? 0, icon: FolderClock, href: '/admin/skill-submissions', color: pendingSkillSubmissions ? 'text-[#a84a00]' : 'text-dg' },
  ]

  // Recent submissions
  const { data: recentSubmissions } = await supabase
    .from('prompt_submissions')
    .select('id, title, submitter_name, submitter_email, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="section-title mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-brand-border rounded-xl p-4 hover:border-fg transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="type-label">
                {stat.label}
              </span>
              <stat.icon size={14} className="text-brand-gray" />
            </div>
            <div className={`font-serif text-display leading-none ${stat.color}`}>
              {stat.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="bg-white border border-brand-border rounded-xl">
        <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-body font-[800] text-brand-black">Recent submissions</h2>
          <Link
            href="/admin/submissions"
            className="text-caption font-[700] text-fg hover:underline"
          >
            View all →
          </Link>
        </div>
        {!recentSubmissions?.length ? (
          <div className="px-5 py-8 text-center text-body-sm font-[600] text-brand-gray">
            No submissions yet.
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {recentSubmissions.map(s => (
              <div key={s.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-[700] text-body-sm text-brand-black truncate">{s.title}</div>
                  <div className="text-caption text-brand-gray font-[600]">
                    {s.submitter_name} · {new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <span className={`meta-pill ${
                  s.status === 'pending'
                    ? 'bg-[#fff0e6] text-[#a84a00]'
                    : s.status === 'approved'
                    ? 'bg-[#e6f4ed] text-[#1a5c35]'
                    : 'bg-[#f0f0f0] text-[#444]'
                }`}>
                  {s.status}
                </span>
                <Link
                  href={`/admin/submissions?id=${s.id}`}
                  className="text-caption font-[700] text-fg hover:underline flex-shrink-0"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
