import { slugify } from '@/lib/utils'

const SKILLS_BUCKET = 'skills-files'

export function getSkillsBucketName(): string {
  return SKILLS_BUCKET
}

export function buildSkillUploadPath(input: {
  skillTitle: string
  versionNumber: number
  fileName: string
}) {
  const safeName = input.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const base = slugify(input.skillTitle)
  return `${base}/v${input.versionNumber}/${Date.now()}-${safeName}`
}

export function acceptedSkillMimeTypes(): string[] {
  return [
    'application/zip',
    'application/x-zip-compressed',
    'text/markdown',
    'text/plain',
    'application/json',
  ]
}

export function acceptedSkillFileExtensions(): string[] {
  return ['.zip', '.md', '.txt', '.json']
}
