import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminUser } from '@/lib/utils'
import Link from 'next/link'
import { LayoutDashboard, FileText, Inbox, BookOpen, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isAdminUser(user.email)) {
    redirect('/login?reason=unauthorized')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/submissions', label: 'Submissions', icon: Inbox },
    { href: '/admin/prompts', label: 'Prompts', icon: FileText },
    { href: '/admin/collections', label: 'Collections', icon: BookOpen },
  ]

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <div className="bg-dg border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-5 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-[900] text-[10px] tracking-[0.2em] uppercase text-lg whitespace-nowrap">
              Convert Digital
            </Link>
            <span className="text-white/20">|</span>
            <span className="font-serif text-[15px] text-white/80">Admin</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12px] font-[700] text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            Back to library
          </Link>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-52 flex-shrink-0 py-6 px-4 border-r border-brand-border min-h-[calc(100vh-49px)]">
          <nav className="space-y-0.5">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-[700] text-brand-gray hover:bg-white hover:text-dg transition-colors"
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-6 px-6 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
