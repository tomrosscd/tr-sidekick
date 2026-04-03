# Sidekick — Convert Digital Prompt Library

An internal prompt library for Convert Digital's ecommerce team. Built with Next.js 15, Supabase, and Tailwind CSS.

---

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon/public key from Supabase dashboard |
| `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` | Yes | Email domain for internal access (e.g. `convertdigital.com.au`) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Yes | Email address for admin access |
| `NEXT_PUBLIC_SITE_URL` | Yes | App URL (used for OAuth redirect; use `http://localhost:3000` locally) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 measurement ID — omit to disable |
| `RESEND_API_KEY` | No | Resend API key for submission email notifications |
| `PROMPT_SUBMISSION_NOTIFY_EMAIL` | No | Where to send submission notification emails |

### 3. Set up Supabase

#### a) Run the schema

In the **Supabase SQL Editor**, run the contents of `supabase/schema.sql`.

This creates:
- `prompts` table
- `prompt_collections` and `prompt_collection_items` tables
- `prompt_submissions` table
- `prompt_events` table
- Row Level Security (RLS) policies
- Helper functions (`is_internal_user`, `is_admin_user`)

#### b) Seed the prompts

In the **Supabase SQL Editor**, run the contents of `supabase/seed.sql`.

This inserts:
- 27 Convert Digital prompts
- 27 Shopify-sourced prompts
- 5 collections with pre-populated items

> **Tip:** If the SQL editor times out on the large seed file, paste and run it in two halves — the Convert section (ends at line ~1096) and the Shopify section onwards.

#### c) Enable Google OAuth

1. In Supabase → **Authentication → Providers**, enable Google
2. Add your Google OAuth Client ID and Secret
3. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`
4. In Google Cloud Console, add `http://localhost:3000/auth/callback` (dev) and your production URL to authorised redirect URIs

### 4. Run locally

```bash
npm run dev
```

---

## Visibility model

| Visitor type | What they can see |
|---|---|
| Anonymous (not signed in) | Prompts with `visibility = 'public'` only |
| Authenticated `@convertdigital.com.au` | All `public` + `internal` prompts |
| Admin (`tom@convertdigital.com.au`) | All prompts including drafts, plus admin area |

All 54 seeded prompts are set to `visibility = 'internal'`, so **you must sign in with a `@convertdigital.com.au` Google account to see them**.

To make specific prompts visible to the public, update their `visibility` to `'public'` via the admin area or directly in Supabase.

---

## Analytics events

Every meaningful user action records an event to `prompt_events` in Supabase (and optionally to GA4).

| Event | When it fires |
|---|---|
| `prompt_view` | User opens a prompt detail page |
| `prompt_copy` | User copies a prompt body |
| `prompt_share` | User copies the share URL |
| `prompt_submit` | User submits a new prompt |
| `search_used` | User types a search query |
| `filter_used` | User applies a filter |

Events include `user_id`, `user_email` (if authenticated), `session_id`, and a `metadata` JSON blob with context.

---

## Auth & access rules

Authentication uses Supabase Auth with Google OAuth. Access is determined by two PostgreSQL helper functions:

- **`is_internal_user()`** — returns `true` if the signed-in user's email ends with `@convertdigital.com.au`
- **`is_admin_user()`** — returns `true` if the signed-in user's email is `tom@convertdigital.com.au`

These are called inside RLS policies, so access enforcement happens at the database level — not just in the UI.

The middleware (`middleware.ts`) also enforces route-level redirects:
- `/admin` → redirects to `/login?reason=unauthorized` if not admin
- `/submit` → redirects to `/login?reason=internal-only` if not internal user

---

## Prompt submission flow

1. Internal users visit `/submit` and fill out the form
2. On submit, the form inserts a row into `prompt_submissions` with `status = 'pending'`
3. An email notification is sent via Resend (if configured)
4. The admin reviews submissions at `/admin/submissions`
5. Approving a submission creates a new `prompt` row and updates the submission to `status = 'approved'`

---

## Timeframe builder

Prompts can contain two template tokens: `{{TF}}` (timeframe) and `{{CMP}}` (comparison period).

These are replaced at copy time based on the user's selection in the header selector:

- `{{TF}}` → e.g. `"the last 30 days"` or a custom date range
- `{{CMP}}` → e.g. `"the previous 30 days"` or `"the same period last year"`

This preserves the original app's dynamic prompt building behaviour without storing any state server-side.

---

## Admin area

Available at `/admin` to `tom@convertdigital.com.au` only.

- **Dashboard** — counts and recent submission log
- **Submissions** — review, approve, or reject user-submitted prompts
- **Prompts** — update visibility/status, toggle featured/recommended flags
- **Collections** — create collections, toggle featured, delete

---

## Verifying the import

After running the seed SQL, verify in the Supabase SQL Editor:

```sql
-- Should return 54
SELECT COUNT(*) FROM prompts;

-- Should return 27 each
SELECT source_label, COUNT(*) FROM prompts GROUP BY source_label;

-- Should return 5
SELECT COUNT(*) FROM prompt_collections;

-- Should return prompts in the collections
SELECT pc.title, COUNT(pci.id) AS prompt_count
FROM prompt_collections pc
LEFT JOIN prompt_collection_items pci ON pci.collection_id = pc.id
GROUP BY pc.title;
```

Then visit the app signed in as a `@convertdigital.com.au` Google account — all 54 prompts should appear.

---

## Tech stack

- **Next.js 15** (App Router, React 19)
- **Supabase** (Postgres + Auth + RLS)
- **Tailwind CSS** + custom brand tokens
- **shadcn/ui** (Radix UI primitives)
- **Sonner** (toast notifications)
- **Resend** (optional email)
- **Lucide React** (icons)
