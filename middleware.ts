import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminUser, isInternalUser } from '@/lib/utils'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — important for SSR
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Admin routes: only tom@convertdigital.com.au
  if (pathname.startsWith('/admin')) {
    if (!user || !isAdminUser(user.email)) {
      return NextResponse.redirect(new URL('/login?reason=unauthorized', request.url))
    }
  }

  // Submit route: internal users only
  if (pathname.startsWith('/submit')) {
    if (!user || !isInternalUser(user.email)) {
      return NextResponse.redirect(new URL('/login?reason=internal-only', request.url))
    }
  }

  // Skills routes: internal users only
  if (pathname.startsWith('/skills') || pathname.startsWith('/api/skills')) {
    if (!user || !isInternalUser(user.email)) {
      return NextResponse.redirect(new URL('/login?reason=internal-only', request.url))
    }
  }

  // Auth callback — allow through
  if (pathname.startsWith('/auth/callback')) {
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
