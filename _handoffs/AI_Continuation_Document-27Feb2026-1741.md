# PROJECT CONTINUATION DOCUMENT
## Session 1 — February 27, 2026

---

### 1. PROJECT IDENTITY

- **Project Name:** OlsenBrands Employee Documentation Platform
- **What This Project Is:** A multi-business employee onboarding and document management system built into OlsenBrands.com. Employees visit a URL for their specific restaurant, sign required documents (starting with a policy acknowledgment), and their signed records are stored centrally. Owners access all records from a single HQ admin dashboard.
- **Primary Objective:** Enable Wedgie's employees to sign the employee policy acknowledgment digitally at `/wedgies/onboarding`, with the signed PDF and record saved to Supabase — as the proof-of-concept for a platform that scales to all 7 OBM businesses.
- **Strategic Intent:** OlsenBrands.com becomes the operational hub for all Olsen Brands Management businesses. This is the first major module. The architecture must support adding new businesses, new document types, and future features (expiration tracking, manager access, notifications) without code changes to the core data model.
- **Hard Constraints:**
  - **No mock data.** Ever. All data must be real and dynamic from Supabase.
  - **No per-business hardcoding.** Business routing must be dynamic via slug — adding a new business requires only a DB row, not a new route or component.
  - **One centralized admin view.** All employee records across all businesses must be accessible from `/hq/employees`. Do not build per-business admin pages.
  - **Private storage only.** All uploaded files and generated PDFs go into the private `employee-documents` Supabase Storage bucket. Never public.
  - **English only** for now.
  - **Jordan + Jennifer admin access only** for now (`jordan@olsenbrands.com`, `jennifer@olsenbrands.com`).
  - **No employee accounts.** Employees identify by name + email only. No passwords, no magic links.

---

### 2. WHAT EXISTS RIGHT NOW

- **Built and working:**
  - All 6 Supabase tables created and verified (see Architecture section)
  - Private Supabase Storage bucket `employee-documents` created (10MB file limit)
  - 7 businesses seeded in `businesses` table with correct slugs
  - `document_types` table has one entry: "Employee Policy Acknowledgment" (slug: `employee-policy`, version `1.0`) with the full Wedgie's policy text stored in the `content` column
  - `business_document_requirements` table has one entry: Wedgie's requires `employee-policy`
  - Wedgie's Employee Policy source document: `/Users/macminim4/clawd/wedgies/employee-policy.md`

- **Partially built:**
  - Nothing in the frontend yet — Phase 2 has not started

- **Broken or blocked:**
  - Nothing blocked. Phase 1 is 100% complete.

- **Not started yet:**
  - All frontend UI (employee onboarding page, signature pad, PDF generation)
  - HQ admin hub (`/hq/employees`)
  - Email notifications (Brevo)
  - Multi-business expansion beyond Wedgie's
  - Policy versioning / re-sign flow

---

### 3. ARCHITECTURE & TECHNICAL MAP

**Tech Stack:**
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Database:** Supabase (Postgres) — project ref `cdywllssnbcdehtrjcqb`
- **Storage:** Supabase Storage — private bucket `employee-documents`
- **Email:** Brevo (Jordan has an existing account — credentials TBD at implementation)
- **PDF Generation:** `@react-pdf/renderer` (to be installed in Phase 2)
- **Signature Pad:** `react-signature-canvas` + `@types/react-signature-canvas` (to be installed in Phase 2)
- **Hosting:** Vercel
- **Repo:** `/Users/macminim4/Developer/olsen-brands/` → `https://github.com/olsenbrands/olsen-brands`
- **Env file:** `/Users/macminim4/Developer/olsen-brands/.env.local`
  - `SUPABASE_URL=https://cdywllssnbcdehtrjcqb.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (present in file)

**Database Schema:**

```sql
businesses (id, name, slug, type, location, active, created_at)
employees (id, first_name, last_name, email, phone, created_at)
employee_businesses (id, employee_id→employees, business_id→businesses, hire_date, active)
document_types (id, name, slug, description, requires_signature, requires_file_upload,
                requires_form_fill, current_version, content, active, created_at)
business_document_requirements (id, business_id→businesses, document_type_id→document_types, required)
employee_documents (id, employee_id→employees, business_id→businesses,
                    document_type_id→document_types, version, status,
                    signature_url, file_url, pdf_url, form_data jsonb,
                    signed_at, expires_at, ip_address, created_at, updated_at)
```

**Seeded Business Slugs:**
| Slug | Business |
|------|----------|
| `wedgies` | Wedgie's, Clinton UT |
| `subway-kaysville` | Subway Kaysville |
| `subway-ogden` | Subway Ogden (Walmart) |
| `subway-morgan` | Subway Morgan |
| `fiiz-clinton` | FiiZ Clinton |
| `fiiz-kaysville-east` | FiiZ East Kaysville |
| `fiiz-kaysville-west` | FiiZ West Kaysville |

**End-to-End Flow (employee onboarding):**
1. Employee visits `/[business-slug]/onboarding` (e.g., `/wedgies/onboarding`)
2. Page fetches business record by slug from `businesses` table
3. Page fetches required document types from `business_document_requirements` joined to `document_types`
4. Employee enters first name, last name, email → upserts into `employees` table
5. Employee reads policy (rendered from `document_types.content`) and signs with signature pad
6. On submit: signature PNG saved to Supabase Storage at `{employee_id}/signatures/{document_id}.png`
7. PDF generated server-side with full policy + employee name + signature + timestamp
8. PDF saved to Supabase Storage at `{employee_id}/pdfs/{document_id}.pdf`
9. `employee_documents` record created: status=`complete`, signed_at=now(), version=`1.0`, ip_address logged
10. `employee_businesses` record created linking employee to business
11. Confirmation screen shown with PDF download link

**File Storage Structure:**
```
employee-documents/ (private bucket)
  {employee_id}/
    signatures/{document_id}.png
    uploads/{document_id}-{filename}
    pdfs/{document_id}.pdf
```

**Naming Conventions:**
- Branch prefix: `steve/`
- Never commit to `main` directly
- Git identity: `Jordan Olsen` / `olsenbrands@users.noreply.github.com` (configured per-repo)
- DB slugs: kebab-case (e.g., `fiiz-kaysville-east`)
- Tailwind only — no CSS modules, no styled-components

**External Dependencies:**
- Supabase (Postgres + Storage) — `cdywllssnbcdehtrjcqb`
- Vercel (hosting + auto-deploy on push to main)
- Brevo (transactional email — not yet integrated)
- `react-signature-canvas` — NOT YET INSTALLED
- `@react-pdf/renderer` — NOT YET INSTALLED

---

### 4. RECENT WORK — WHAT JUST HAPPENED

**What was worked on this session:**
- Wrote the full 18-section Wedgie's Employee Policy document (`/Users/macminim4/clawd/wedgies/employee-policy.md`)
- Designed the full multi-business platform architecture
- Created PRD (`_handoffs/olsenbrands-employee-backend-PRD.md`)
- Created progress tracker (`_handoffs/olsenbrands-employee-backend-progress.md`)
- Created `/olsenbrands-backend-build` skill for context restoration (`~/clawd/skills/olsenbrands-backend-build/SKILL.md`)
- Executed Phase 1 entirely: created all DB tables, storage bucket, seeded all businesses, loaded policy

**Key decisions made and WHY:**
- **Name + email only (no accounts):** Lowest friction for hourly restaurant workers on their phones. The goal is completion, not security theater on a policy form.
- **Document types are global, not per-business:** A document type (e.g., "Employee Policy Acknowledgment") is defined once. Which businesses require it is a separate join table (`business_document_requirements`). This means you can assign the same doc type to multiple businesses OR create distinct versions. The Wedgie's policy content lives in `document_types.content` for v1.0.
- **Policy content stored in DB, not code:** Enables Jordan to update policy text from an admin UI in the future without a code deploy.
- **Supabase Storage for all files (private bucket):** Files are never publicly accessible. Signed URLs used for download. Keeps compliance clean.
- **Brevo for email:** Jordan already has an account. Avoids introducing a new vendor.
- **`@react-pdf/renderer` over jsPDF:** Better React integration, server-side rendering, cleaner output for multi-page policy documents.

**What changed in the system:**
- 6 new tables in Supabase (all confirmed present)
- 1 new private storage bucket (`employee-documents`)
- 7 businesses seeded
- 1 document type created with full Wedgie's policy text (v1.0)
- 1 `business_document_requirements` row: Wedgie's requires `employee-policy`

**Discussed but NOT yet implemented:**
- Employee onboarding UI (Phase 2 — next)
- HQ admin hub (Phase 3)
- Brevo email integration (Phase 3/4)
- Policy re-sign flow when version updates
- "Send reminder" button for employees who haven't completed docs
- Jennifer's admin access implementation
- Document expiration tracking (Phase 5 — explicitly deferred)

**Open threads:**
- Brevo API key / credentials not yet retrieved — will need when building email notifications
- Jennifer's admin access: needs to be wired into whatever auth layer protects `/hq/employees`
- The existing `/hq` dashboard on OlsenBrands.com has an auth system — need to understand it before building Phase 3 admin routes

---

### 5. WHAT COULD GO WRONG

- **Supabase RLS not configured:** Tables were created without Row Level Security policies. For the employee onboarding flow using the service role key server-side, this is fine. But if any client-side Supabase calls are made with the anon key, anyone could read/write all employee data. Phase 2 must use server-side API routes — never expose the service role key to the browser.
- **PDF generation on Vercel:** `@react-pdf/renderer` can be heavy. If PDF generation happens in a Vercel serverless function, watch the 50MB bundle size limit and 10s execution timeout. Consider generating PDFs via a background job or edge function if needed.
- **`react-signature-canvas` SSR:** This package uses browser canvas APIs. It will throw on server-side render. Must be wrapped in `dynamic(() => import(...), { ssr: false })`.
- **Wedgie's policy content is business-specific:** The current `document_types.content` contains "Wedgie's LLC" references throughout. If this same document type is ever assigned to Subway or FiiZ, employees would sign a Wedgie's-branded document. For now, only Wedgie's is assigned this doc type — but be careful not to accidentally assign it to other businesses.
- **Git identity:** This repo requires `olsenbrands@users.noreply.github.com` as the commit email or Vercel auto-deploy will fail. Verify before every commit: `git config user.email`.
- **Existing HQ auth system:** The current `/hq` routes have some form of auth already. Don't assume — check before adding new `/hq/employees` routes.

**Technical debt:**
- No RLS policies on the new tables yet — acceptable for Phase 1/2, should be addressed before public launch
- No `updated_at` trigger on `employee_documents` — the column exists but won't auto-update without a trigger

**Assumptions that could be wrong:**
- Assumed Brevo can send transactional email from `@olsenbrands.com` — needs to be verified (domain may need DNS setup)
- Assumed the existing HQ auth protects routes via middleware — not verified yet

---

### 6. HOW TO THINK ABOUT THIS PROJECT

**1. Core architectural pattern and why it was chosen:**
The system is built around three normalized entities: **businesses**, **employees**, and **document types** — all connected through join tables. This is a classic many-to-many relational design. It was chosen specifically so that adding a new business, a new employee, or a new document requirement is purely a data operation — no code changes required. The alternative (hardcoded per-restaurant pages and forms) would require a new codebase for every new location. This architecture scales to 100 restaurants without touching the frontend routing.

**2. Most common mistake a new person would make:**
Building per-business pages or components. The entire point is that `/[business-slug]/onboarding` is ONE dynamic route that resolves everything from the database based on the slug. A new developer might instinctively create `/wedgies/onboarding/page.tsx`, `/fiiz/onboarding/page.tsx`, etc. That is wrong. There should be exactly one route file: `/[business-slug]/onboarding/page.tsx`.

**3. What looks like it should be refactored but shouldn't be:**
The policy content living inside the `document_types` table alongside the metadata (name, slug, requires_signature, etc.) might look like a violation of separation of concerns — "shouldn't the policy content be in a separate content table?" Don't touch it. Storing content with the document type is intentional: it keeps versioning simple (bump `current_version`, update `content`, log who has signed which version), and it avoids a join just to render a document. The tradeoff is acceptable for this use case.

---

### 7. DO NOT TOUCH LIST

- **Do NOT** refactor the DB schema without explicit instruction — it was designed deliberately and Phase 1 data already exists.
- **Do NOT** create per-business route files. All onboarding routes must go through `/[business-slug]/onboarding/page.tsx`.
- **Do NOT** expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Server-side API routes only for DB writes.
- **Do NOT** use the anon key for write operations.
- **Do NOT** assign the `employee-policy` document type to any business other than Wedgie's — the content is Wedgie's-specific.
- **Do NOT** add mock/seed employee data for testing. Use real form submissions.
- **Do NOT** introduce new ORMs, query builders, or abstraction layers over Supabase client calls without asking.
- **Do NOT** change the storage bucket from private to public.
- **Do NOT** commit directly to `main`.
- **Preserve the slug naming convention** — kebab-case, matches what's seeded in the DB.

---

### 8. CONFIDENCE & FRESHNESS

| Section | Confidence | Notes |
|---------|-----------|-------|
| Database schema & seeded data | ✅ HIGH | Created and verified this session |
| Storage bucket | ✅ HIGH | Created and confirmed this session |
| Business slugs | ✅ HIGH | Seeded and returned from DB this session |
| Policy content in DB | ✅ HIGH | Inserted with dollar-quoting, confirmed return |
| Business_document_requirements | ✅ HIGH | Wedgie's → employee-policy confirmed |
| Existing HQ auth system | ⚠️ MEDIUM | Known to exist, not inspected this session |
| Brevo account/credentials | ⚠️ MEDIUM | Jordan confirmed he has an account; no API key retrieved |
| Vercel deployment config | ⚠️ MEDIUM | Known to work for existing site; not tested for new routes |
| `react-signature-canvas` SSR behavior | ✅ HIGH | Known library limitation — must use dynamic import |
| RLS on new tables | ❓ LOW | Not configured — assumed absent, should be verified |

---

## RESUME PROMPT

```
You are resuming an active software build. Before doing anything else, read this file in full:

/Users/macminim4/Developer/olsen-brands/_handoffs/AI_Continuation_Document-27Feb2026-1741.md

This is an AI Continuation Document. It contains the full project state, architecture, decisions, constraints, and what was just completed. Read every section. Do not skim.

After reading, do the following:

1. Summarize your understanding of the current project state in 3–5 sentences. Include: what the project is, what phase we're in, what was just completed, and what is next.

2. Confirm the exact next action you will take.

3. Ask clarification questions ONLY if something genuinely blocks execution. Do not ask questions you can answer from the document.

4. Then begin working.

Additional context files you should also read before starting:
- /Users/macminim4/Developer/olsen-brands/_handoffs/olsenbrands-employee-backend-PRD.md
- /Users/macminim4/Developer/olsen-brands/_handoffs/olsenbrands-employee-backend-progress.md

---

USER DIRECTIVE:

Phase 2 is next — the Wedgie's onboarding page. This is the actual UI build in the repo. Before starting the UI, install two new packages:
- react-signature-canvas (+ @types/react-signature-canvas) — the signature pad
- @react-pdf/renderer — PDF generation

Then build the employee onboarding page at /[business-slug]/onboarding/page.tsx as a single dynamic route. The first business to go live is Wedgie's (slug: "wedgies"). Do not create per-business page files.

Repo is at: /Users/macminim4/Developer/olsen-brands/
Branch from main using prefix: steve/
Git identity must be: olsenbrands@users.noreply.github.com
```
