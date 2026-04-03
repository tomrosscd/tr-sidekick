import type { PromptSubmission } from '@/types'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_EMAIL = process.env.PROMPT_SUBMISSION_NOTIFY_EMAIL ?? 'tom@convertdigital.com.au'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function sendSubmissionNotification(
  submission: Pick<
    PromptSubmission,
    'id' | 'title' | 'short_description' | 'submitter_name' | 'submitter_email'
  >
): Promise<void> {
  // If RESEND_API_KEY is not set, skip silently — feature is scaffolded but not active
  if (!RESEND_API_KEY) {
    console.log('[email] RESEND_API_KEY not configured — skipping submission notification')
    return
  }

  const reviewUrl = `${SITE_URL}/admin/submissions`

  const { Resend } = await import('resend')
  const resend = new Resend(RESEND_API_KEY)

  await resend.emails.send({
    from: 'Sidekick <noreply@convertdigital.com.au>',
    to: NOTIFY_EMAIL,
    subject: `New prompt submission: ${submission.title}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #27382f; margin-bottom: 8px;">New Prompt Submission</h2>
        <p style="color: #7a8a84; margin-bottom: 24px; font-size: 14px;">A new prompt has been submitted for review.</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px 0; color: #7a8a84; font-size: 13px; width: 140px; vertical-align: top;">Title</td>
            <td style="padding: 10px 0; color: #171717; font-size: 13px; font-weight: 600;">${escapeHtml(submission.title)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #7a8a84; font-size: 13px; vertical-align: top;">Description</td>
            <td style="padding: 10px 0; color: #3c4840; font-size: 13px;">${escapeHtml(submission.short_description)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #7a8a84; font-size: 13px; vertical-align: top;">Submitted by</td>
            <td style="padding: 10px 0; color: #171717; font-size: 13px;">${escapeHtml(submission.submitter_name)} &lt;${escapeHtml(submission.submitter_email)}&gt;</td>
          </tr>
        </table>

        <a href="${reviewUrl}"
           style="display: inline-block; background: #27382f; color: #fff; padding: 12px 24px;
                  border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Review in Admin →
        </a>
      </div>
    `,
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
