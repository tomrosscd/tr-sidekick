import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('prompt_events').insert({
      prompt_id: body.prompt_id ?? null,
      event_type: body.event_type,
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      session_id: body.session_id ?? null,
      metadata: body.metadata ?? {},
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Analytics should never break the app
    return NextResponse.json({ ok: true })
  }
}
