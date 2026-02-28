# PROJECT CONTINUATION DOCUMENT
## Session 2 — February 27, 2026

---

### 1. PROJECT IDENTITY

- **Project Name:** OlsenBrands Employee Documentation Platform
- **What This Project Is:** A multi-business employee onboarding and document management system built into OlsenBrands.com. Employees visit a URL for their specific restaurant, sign required documents and upload permits, and all records are stored centrally. Owners access everything from a single HQ admin dashboard.
- **Primary Objective:** Phase 3 — build `/hq/employees` so Jordan can log in and see all employee submissions across all businesses: who signed what, when, and download the PDFs.
- **Strategic Intent:** OlsenBrands.com becomes the operational hub for all 7 Olsen Brands Management businesses. The employee docs platform is the first major operational module. Architecture must support adding new businesses and document types without code changes.
- **Hard Constraints:**
  - **No mock data. Ever.** All data is dynamic from Supabase.
  - **One dynamic route for all businesses** — `/[business-slug]/onboarding` handles everything via slug. Never create per-business files.
  - **Server-side only for Supabase writes** — never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. All DB writes go through API routes.
  - **Private storage only** — all files in private `employee-documents` bucket. Never public.
  - **Admin access:** Jordan (`jordan@olsenbrands.com`) + Jennifer (`jennifer@olsenbrands.com`) only.
  - **HQ login:** password-based via `/login` → sets `hq-auth=authenticated` cookie → protects all `/hq/*` routes via middleware.
  - **Git identity:** `olsenbrands@users.noreply.github.com` — required or Vercel auto-deploy fails.
  - **Branch prefix:** `steve/`

---

### 2. WHAT EXISTS RIGHT NOW

**Built and working (verified in production):**
- All 6 Supabase tables (see Architecture section)
- Private Supabase Storage bucket `employee-documents`
- 7 businesses seeded in `businesses` table
- 2 document types in `document_types`:
  - `employee-policy` (v1.3) — signature required, full policy text in `content` field
  - `food-handler-permit` (v1.0) — file upload required, no content
- Both document types assigned to Wedgie's in `business_document_requirements`
- Dynamic onboarding page at `/[business-slug]/onboarding` — live at `olsenbrands.com/wedgies/onboarding`
- Multi-step flow: identity → sign policy → upload permit → confirmation
- PDF generation server-side (`@react-pdf/renderer`) — signature PNG embedded, proper name/date/signature block, no manager section
- File upload to private Supabase Storage
- Force-download on PDF (fetch → blob → `a.download`, not open in browser tab)
- HQ login at `olsenbrands.com/login` — password: `olsenbrands2026`
- Existing `/hq` dashboard (crons, activity, ventures) — protected by middleware

**Not started yet:**
- `/hq/employees` — employee list, filter, search (Phase 3)
- `/hq/employees/[id]` — individual employee profile with all their docs (Phase 3)
- Brevo email notifications (Phase 4)
- Policy re-sign flow when version updates (Phase 5)
- Multi-business expansion beyond Wedgie's (Phase 4)

---

### 3. ARCHITECTURE & TECHNICAL MAP

**Tech Stack:**
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Database/Storage:** Supabase (Postgres + private Storage) — project ref `cdywllssnbcdehtrjcqb`
- **PDF Generation:** `@react-pdf/renderer` (server-side, API routes only)
- **Signature Pad:** `react-signature-canvas` (client-side, dynamic import, SSR disabled)
- **Hosting:** Vercel (auto-deploys on push to `main` from `olsenbrands@users.noreply.github.com`)
- **Repo:** `/Users/macminim4/Developer/olsen-brands/` → `https://github.com/olsenbrands/olsen-brands`
- **Env file:** `/Users/macminim4/Developer/olsen-brands/.env.local`
  - `SUPABASE_URL=https://cdywllssnbcdehtrjcqb.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...` (present)
  - `HQ_PASSWORD=olsenbrands2026` (fallback hardcoded in auth route)

**Database Schema:**

```sql
businesses        (id, name, slug, type, location, active, created_at)
employees         (id, first_name, last_name, email, phone, created_at)
employee_businesses (id, employee_id→employees, business_id→businesses, hire_date, active)
document_types    (id, name, slug, description, requires_signature, requires_file_upload,
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

**File Structure (relevant to this project):**

```
src/
  lib/
    supabase.ts                          ← shared server Supabase client (service role)
  app/
    [business-slug]/
      onboarding/
        page.tsx                         ← employee-facing onboarding (client component)
    api/
      auth/login/route.ts                ← HQ password login, sets hq-auth cookie
      onboarding/[slug]/
        route.ts                         ← GET: fetch business + required doc types
        submit/route.tsx                 ← POST: sign policy, generate/upload PDF
        upload/route.ts                  ← POST: upload file (food handler permit etc.)
    hq/
      page.tsx                           ← existing HQ dashboard (crons, activity, ventures)
      layout.tsx                         ← HQ layout wrapper
      components/...                     ← existing HQ components
  components/
    onboarding/
      SignaturePad.tsx                   ← client-only signature pad (react-signature-canvas)
middleware.ts                            ← protects /hq/* and /api/hq/* with hq-auth cookie
_handoffs/
  olsenbrands-employee-backend-PRD.md
  olsenbrands-employee-backend-progress.md
  AI_Continuation_Document-27Feb2026-1741.md  ← previous handoff
  AI_Continuation_Document-27Feb2026-1958.md  ← THIS FILE
```

**Supabase Client Pattern (server-side):**
```ts
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase.from('employees').select('*');
```

**Auth / HQ Middleware:**
- Middleware at `src/middleware.ts` checks `hq-auth` cookie on all `/hq/*` and `/api/hq/*` routes
- If not authenticated → redirects to `/login?redirect=<path>`
- Login at `/api/auth/login` — POST `{ password }` — sets 30-day cookie on match

**End-to-End Employee Onboarding Flow:**
1. Employee visits `/wedgies/onboarding`
2. GET `/api/onboarding/wedgies` → returns business + array of required doc types
3. Employee enters name + email → stored in state (not yet saved to DB)
4. **For each document in order:**
   - If `requires_signature`: show scrollable policy text + signature pad → POST `/api/onboarding/[slug]/submit`
     - Upserts `employees` record (returns `employeeId`)
     - Upserts `employee_businesses`
     - Uploads signature PNG → `{employeeId}/signatures/{docId}.png`
     - Generates PDF server-side → uploads → `{employeeId}/pdfs/{docId}.pdf`
     - Creates `employee_documents` record (status=complete)
     - Returns `{ employeeId, documentId, pdfDownloadUrl }` (signed URL, 1hr)
   - If `requires_file_upload`: show file upload zone → POST `/api/onboarding/[slug]/upload`
     - Uses `employeeId` from previous step
     - Uploads file → `{employeeId}/uploads/{docId}-permit.{ext}`
     - Creates `employee_documents` record (status=complete)
5. After all docs → confirmation screen with force-download PDF button

**Storage Path Structure:**
```
employee-documents/ (private)
  {employee_id}/
    signatures/{document_id}.png
    uploads/{document_id}-permit.{ext}
    pdfs/{document_id}.pdf
```

---

### 4. RECENT WORK — WHAT JUST HAPPENED

**What was worked on this session:**
- Built the entire Phase 2 employee onboarding page from scratch
- Added Food Handler's Permit as a second document type, assigned to Wedgie's
- Rewrote the Wedgie's Employee Policy from formal legalese to plain English (v1.1 → v1.2 → v1.3)
- Multiple policy content iterations per Jordan's feedback:
  - v1.1: initial formal version
  - v1.2: plain English, 7th grade reading level, scenarios per section
  - v1.3: additional sections (Break Policy, Employee Discount), updated Scheduling/Phones/Theft sections, removed Manager/Owner signature block
- Fixed PDF bugs: `{{EFFECTIVE_DATE}}` placeholder not being replaced, `**markdown**` asterisks rendering raw
- Fixed download button: was opening PDF in browser tab, now forces save to device
- Rebuilt PDF signature block: now shows "Employee Full Name (Print): [name]", "Date: [date]", then signature image — no blank lines, no manager section

**Key decisions made and WHY:**
- **Markdown stored in DB, stripped for PDF:** Policy content is authored in markdown (readable for future admin editing), but stripped to plain text for PDF rendering via `stripMarkdown()` in `submit/route.tsx`. This lets Jordan edit the policy via markdown without worrying about PDF formatting.
- **`{{EFFECTIVE_DATE}}` replaced at render time:** The date placeholder in the policy content is replaced client-side when displaying on the page and server-side when generating the PDF. This means the stored content always has the placeholder — no stale dates in the DB.
- **Multi-doc flow via `activeDocIndex`:** The page cycles through `documentTypes[]` in order. After each submission, it increments the index. After the last doc, it transitions to `complete`. This is generic — adding a 3rd doc type requires only a DB row.
- **`employeeId` threaded through the flow:** The first submission (policy sign) creates the `employees` record and returns `employeeId`. Subsequent submissions (file uploads) pass `employeeId` in the request body so all records link to the same employee without re-querying.
- **Force download via fetch+blob:** Using `<a download>` alone doesn't work reliably for cross-origin signed URLs. The page fetches the URL, creates a Blob, creates an object URL, sets `a.download`, clicks it, then revokes. Falls back to `window.open` on error.

**What changed in the system (all deployed to production):**
- New files: `src/app/[business-slug]/onboarding/page.tsx`, `src/app/api/onboarding/[slug]/route.ts`, `src/app/api/onboarding/[slug]/submit/route.tsx`, `src/app/api/onboarding/[slug]/upload/route.ts`, `src/components/onboarding/SignaturePad.tsx`, `src/lib/supabase.ts`
- DB: `food-handler-permit` document type added; assigned to Wedgie's
- DB: `employee-policy` content updated to v1.3 (12,369 chars)
- New npm packages: `react-signature-canvas`, `@types/react-signature-canvas`, `@react-pdf/renderer`

**Discussed but NOT yet implemented:**
- Phase 3: `/hq/employees` admin view — THIS IS NEXT
- Brevo email notifications to employees on completion
- Policy re-sign flow when version is updated

---

### 5. WHAT COULD GO WRONG

- **No RLS on new tables.** All DB access goes through service role key server-side — this is intentional and correct for now. Do not add client-side Supabase calls using the anon key. If you ever need client-side Supabase, use the anon key with carefully defined RLS policies.
- **Signed URLs expire in 1 hour.** The PDF download URL returned on the confirmation screen is a 1-hour signed URL. If an employee waits too long to download, the link will be dead. Phase 3 should generate fresh signed URLs on demand from the admin view — do not store signed URLs in the DB.
- **`@react-pdf/renderer` SSR limitation.** The PDF generation happens in an API route (server-side only) — this is correct. Never import `@react-pdf/renderer` in a client component or a server component that runs during static generation.
- **`react-signature-canvas` SSR.** The SignaturePad component must always use `dynamic(() => import(...), { ssr: false })`. If SSR is accidentally enabled, it will throw on canvas APIs.
- **Git identity.** Every commit MUST use `olsenbrands@users.noreply.github.com`. Verify with `git config user.email` before committing. Wrong email = Vercel auto-deploy blocked.
- **File uploads on Vercel.** Vercel serverless functions have a 4.5MB body size limit by default. The upload route accepts up to 10MB. Need to verify this works in production — may need `export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }` if issues arise. (Next.js App Router uses `formData()` which should bypass this, but worth watching.)
- **Wedgie's policy content is business-specific.** The `employee-policy` document type content references "Wedgie's" throughout. Do NOT assign this document type to Subway or FiiZ. Each business needing a policy should get its own document type with its own content.

---

### 6. HOW TO THINK ABOUT THIS PROJECT

**1. Core architectural pattern:**
Three normalized entities — businesses, employees, document types — connected through join tables. Everything is data-driven. Adding a new business = one DB row. Adding a new document requirement = one join table row. The onboarding page is a single dynamic route that resolves everything from the database based on the URL slug. This was chosen specifically so the platform scales to 100 locations without touching code.

**2. Most common mistake a new person would make:**
Building per-business pages or hardcoding business logic. The entire architecture assumes ONE route file handles ALL businesses. A new developer might see `/wedgies/onboarding` and instinctively create a static page for it. That's wrong — `[business-slug]` is a dynamic catch-all.

**3. What looks like it should be refactored but shouldn't be:**
The policy content living in `document_types.content` alongside metadata. It might look like a violation of separation of concerns. Don't touch it. It's intentional — keeps versioning simple, avoids an extra join, and makes the future admin UI (edit policy content inline) trivial to build.

---

### 7. DO NOT TOUCH LIST

- **Do NOT** modify the DB schema without explicit instruction — Phase 1 data exists and the schema was designed deliberately.
- **Do NOT** create per-business route files. All onboarding routes go through `/[business-slug]/onboarding/page.tsx`.
- **Do NOT** expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Server-side API routes only.
- **Do NOT** assign `employee-policy` to any business other than Wedgie's — content is Wedgie's-specific.
- **Do NOT** add mock/seed employee data. All test data should come from real form submissions.
- **Do NOT** store signed URLs in the DB — they expire. Generate them on demand.
- **Do NOT** commit directly to `main`. Always branch `steve/<task-name>`.
- **Do NOT** change the storage bucket from private to public.
- **Preserve all slug naming** — kebab-case, matches what's seeded.

---

### 8. CONFIDENCE & FRESHNESS

| Section | Confidence | Notes |
|---------|-----------|-------|
| DB schema, tables, seeded data | ✅ HIGH | Verified and built across both sessions |
| Onboarding page flow | ✅ HIGH | Built, tested, confirmed working in production this session |
| PDF generation + signature block | ✅ HIGH | Fixed and verified against Jordan's test PDF this session |
| Force-download behavior | ✅ HIGH | Implemented and deployed this session |
| Food Handler's Permit doc type + requirement | ✅ HIGH | Created in DB this session |
| Policy content v1.3 | ✅ HIGH | Updated in DB this session |
| HQ login (password: olsenbrands2026) | ✅ HIGH | Verified route and confirmed working this session |
| Existing HQ dashboard routes | ⚠️ MEDIUM | Known to exist, not inspected in detail this session |
| Vercel file upload limit (10MB) | ❓ LOW | Assumed to work; not stress-tested in production |
| Brevo credentials/API key | ❓ LOW | Jordan confirmed account exists; not retrieved or used yet |

---

## RESUME PROMPT

```
You are resuming an active software build. Before doing anything else, read this file in full:

/Users/macminim4/Developer/olsen-brands/_handoffs/AI_Continuation_Document-27Feb2026-1958.md

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

Phase 3 is next — the HQ admin view at /hq/employees.

Build the employee admin hub so Jordan can log in at olsenbrands.com/login (password: olsenbrands2026) and see everything employees have submitted.

What Phase 3 needs:

1. /hq/employees — main employee list page
   - Table/list of all employees across all businesses
   - Columns: employee name, email, business(es), documents status (complete/missing), date of most recent submission
   - Filter by business (dropdown)
   - Filter by status (all / complete / missing items)
   - Search by employee name
   - Click any row → goes to employee detail page

2. /hq/employees/[id] — individual employee profile
   - Employee name, email, hire date
   - List of all required documents for their business(es)
   - For each document: status badge (complete / pending / missing), version signed, date signed
   - For signature docs: "Download PDF" button (generates fresh signed URL — do NOT use stored URLs, they expire)
   - For file upload docs: "View File" button (generates fresh signed URL)
   - IP address logged on submission (visible to admin for audit trail)

Design: match the existing HQ dark aesthetic — bg #0f0f0f, cream text #efe5cd, red accent #c9533c. Look at existing HQ components in src/app/hq/ for patterns.

Auth: these routes are already protected by middleware (hq-auth cookie). No new auth needed.

Tech notes:
- Supabase service role key is at src/lib/supabase.ts — use this for all DB queries
- Generate signed URLs on demand: supabase.storage.from('employee-documents').createSignedUrl(path, 3600)
- All routes must be server components or use server-side API routes — never expose service role key to browser
- Repo: /Users/macminim4/Developer/olsen-brands/
- Branch from main: steve/phase3-hq-employees
- Git identity must be: olsenbrands@users.noreply.github.com
```
