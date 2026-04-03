import { NextResponse } from 'next/server'
import { sendSubmissionNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    await sendSubmissionNotification({
      id: body.id ?? 'unknown',
      title: body.title ?? '',
      short_description: body.short_description ?? '',
      submitter_name: body.submitter_name ?? '',
      submitter_email: body.submitter_email ?? '',
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Don't fail the request if email fails
    console.error('[submit-prompt] email error:', error)
    return NextResponse.json({ ok: true, note: 'Email notification skipped' })
  }
}
