// ─── Enums ────────────────────────────────────────────────────────────────────

export type Visibility = 'public' | 'internal' | 'draft'
export type PromptStatus = 'published' | 'archived' | 'draft'
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'
export type SkillVisibility = 'internal' | 'draft'
export type SkillStatus = 'published' | 'archived' | 'draft'
export type SkillSubmissionStatus = 'pending' | 'approved' | 'rejected'
export type SkillSubmissionType = 'new' | 'update'
export type EventType =
  | 'prompt_view'
  | 'prompt_copy'
  | 'prompt_share'
  | 'prompt_submit'
  | 'search_used'
  | 'filter_used'

// ─── Prompt ───────────────────────────────────────────────────────────────────

export interface Prompt {
  id: string
  slug: string
  title: string
  short_description: string
  prompt_body: string
  category: string
  use_cases: string[]
  data_sources: string[]
  output_types: string[]
  business_objectives: string[]
  funnel_stages: string[]
  level: ExperienceLevel
  visibility: Visibility
  status: PromptStatus
  when_to_use: string | null
  caveats: string | null
  follow_up_prompt_ids: string[]
  is_featured: boolean
  is_recommended: boolean
  source_label: string | null
  created_by: string | null
  reviewed_by: string | null
  owner_name: string | null
  version: number
  current_version_id: string | null
  last_reviewed_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

// ─── Prompt Version ───────────────────────────────────────────────────────────

export interface PromptVersion {
  id: string
  prompt_id: string
  version_number: number
  prompt_body: string
  change_notes: string | null
  created_by: string | null
  created_by_name: string | null
  created_at: string
}

// ─── Prompt Collection ────────────────────────────────────────────────────────

export interface PromptCollection {
  id: string
  slug: string
  title: string
  description: string | null
  visibility: Visibility
  is_featured: boolean
  created_at: string
  updated_at: string
  // joined
  items?: PromptCollectionItem[]
}

export interface PromptCollectionItem {
  id: string
  collection_id: string
  prompt_id: string
  sort_order: number
  // joined
  prompt?: Prompt
}

// ─── Prompt Submission ────────────────────────────────────────────────────────

export interface PromptSubmission {
  id: string
  submitted_by: string | null
  submitter_name: string
  submitter_email: string
  title: string
  short_description: string
  prompt_body: string
  category: string
  use_cases: string[]
  data_sources: string[]
  notes: string | null
  status: SubmissionStatus
  reviewer_notes: string | null
  created_at: string
  reviewed_at: string | null
}

// ─── Prompt Event ─────────────────────────────────────────────────────────────

export interface PromptEvent {
  id: string
  prompt_id: string | null
  event_type: EventType
  user_id: string | null
  user_email: string | null
  session_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  slug: string
  title: string
  short_description: string | null
  category: string
  use_cases: string[]
  owner_name: string | null
  visibility: SkillVisibility
  status: SkillStatus
  is_featured: boolean
  is_recommended: boolean
  created_by: string | null
  updated_by: string | null
  current_version_id: string | null
  created_at: string
  updated_at: string
}

export interface SkillVersion {
  id: string
  skill_id: string
  version_number: number
  version_label: string | null
  changelog: string | null
  content_markdown: string | null
  status: SkillStatus
  created_by: string | null
  created_at: string
}

export interface SkillSubmission {
  id: string
  submission_type: SkillSubmissionType
  skill_id: string | null
  submitted_by: string | null
  submitter_name: string
  submitter_email: string
  title: string
  short_description: string | null
  category: string
  use_cases: string[]
  owner_name: string | null
  version_number: number | null
  version_label: string | null
  changelog: string | null
  content_markdown: string | null
  status: SkillSubmissionStatus
  reviewer_notes: string | null
  created_at: string
  reviewed_at: string | null
}

export interface SkillFile {
  id: string
  skill_id: string | null
  skill_version_id: string | null
  submission_id: string | null
  file_name: string
  storage_path: string
  mime_type: string | null
  file_size_bytes: number | null
  uploaded_by: string | null
  uploaded_at: string
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  search: string
  category: string
  source: string       // 'all' | 'convert' | 'shopify'
  useCases: string[]
  dataSources: string[]
  level: string        // '' | 'beginner' | 'intermediate' | 'advanced'
  featured: boolean
  recommended: boolean
  // admin only
  visibility: string
  status: string
}

// ─── Timeframe State ──────────────────────────────────────────────────────────

export interface TimeframeState {
  timeframe: string
  comparison: 'prev' | 'yoy' | 'none'
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  isInternal: boolean  // @convertdigital.com.au
  isAdmin: boolean     // tom@convertdigital.com.au
}

// ─── Category Config ──────────────────────────────────────────────────────────

export interface CategoryConfig {
  label: string
  value: string
  pillClass: string
}

export const CATEGORIES: CategoryConfig[] = [
  { label: 'All', value: 'All', pillClass: '' },
  { label: 'CRO', value: 'CRO', pillClass: 'bg-[#e6f4ed] text-[#1a5c35]' },
  { label: 'LTV', value: 'LTV', pillClass: 'bg-[#fef8dc] text-[#7a5800]' },
  { label: 'BFCM', value: 'BFCM', pillClass: 'bg-[#fff0e6] text-[#b03800]' },
  { label: 'Strategy', value: 'Strategy', pillClass: 'bg-[#edf0f7] text-[#2d3d6b]' },
  { label: 'Acquisition', value: 'Acquisition', pillClass: 'bg-[#f0e8ff] text-[#531fa0]' },
  { label: 'SEO', value: 'SEO', pillClass: 'bg-[#e6effe] text-[#1044a8]' },
  { label: 'Subscriptions', value: 'Subscriptions', pillClass: 'bg-[#fce8f5] text-[#7d0e52]' },
  { label: 'Tech', value: 'Tech', pillClass: 'bg-[#f0f0f0] text-[#444]' },
]

export const USE_CASE_OPTIONS = [
  'onboarding',
  'pre-launch',
  'post-launch',
  'weekly-review',
  'monthly-reporting',
  'issue-investigation',
  'opportunity-discovery',
  'client-presentation',
  'internal-strategy',
  'trading-review',
  'qa-validation',
] as const

export type UseCase = typeof USE_CASE_OPTIONS[number]

export const USE_CASE_LABELS: Record<string, string> = {
  'onboarding': 'Onboarding',
  'pre-launch': 'Pre-launch',
  'post-launch': 'Post-launch',
  'weekly-review': 'Weekly review',
  'monthly-reporting': 'Monthly reporting',
  'issue-investigation': 'Issue investigation',
  'opportunity-discovery': 'Opportunity discovery',
  'client-presentation': 'Client presentation',
  'internal-strategy': 'Internal strategy',
  'trading-review': 'Trading review',
  'qa-validation': 'QA / Validation',
}

export const TIMEFRAME_PRESETS = [
  { label: '7d', value: 'last 7 days' },
  { label: '14d', value: 'last 14 days' },
  { label: '30d', value: 'last 30 days' },
  { label: '60d', value: 'last 60 days' },
  { label: '90d', value: 'last 90 days' },
  { label: 'Last quarter', value: 'last quarter' },
  { label: '6 months', value: 'last 6 months' },
  { label: '12 months', value: 'last 12 months' },
]

export const COMPARISON_OPTIONS = [
  { label: 'Previous period', value: 'prev' },
  { label: 'Same period last year', value: 'yoy' },
  { label: 'No comparison', value: 'none' },
]

export const SKILL_CATEGORIES = [
  'Prompting',
  'Data',
  'Conversion',
  'Analytics',
  'Automation',
  'Operations',
  'Documentation',
  'Research',
] as const

export const SKILL_USE_CASE_OPTIONS = [
  'new-client-onboarding',
  'weekly-analysis',
  'monthly-reporting',
  'cro-audit',
  'qa-validation',
  'strategy-planning',
  'internal-enablement',
] as const

export const SKILL_USE_CASE_LABELS: Record<string, string> = {
  'new-client-onboarding': 'New client onboarding',
  'weekly-analysis': 'Weekly analysis',
  'monthly-reporting': 'Monthly reporting',
  'cro-audit': 'CRO audit',
  'qa-validation': 'QA / validation',
  'strategy-planning': 'Strategy planning',
  'internal-enablement': 'Internal enablement',
}
