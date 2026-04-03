import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildSkillUploadPath, getSkillsBucketName, acceptedSkillFileExtensions } from '@/lib/skills-storage'
import { isInternalUser } from '@/lib/utils'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !isInternalUser(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { skillTitle, versionNumber, fileName } = body as {
    skillTitle?: string
    versionNumber?: number
    fileName?: string
  }

  if (!skillTitle || !versionNumber || !fileName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const ext = fileName.includes('.') ? `.${fileName.split('.').pop()?.toLowerCase()}` : ''
  if (!acceptedSkillFileExtensions().includes(ext)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const path = buildSkillUploadPath({ skillTitle, versionNumber, fileName })
  const { data, error } = await supabase.storage
    .from(getSkillsBucketName())
    .createSignedUploadUrl(path)

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Could not create upload URL' }, { status: 400 })
  }

  return NextResponse.json({
    path,
    token: data.token,
  })
}
