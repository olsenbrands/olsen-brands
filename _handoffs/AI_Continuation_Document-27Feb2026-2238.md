# PROJECT CONTINUATION DOCUMENT
## Session 4 — February 27, 2026

---

### 1. PROJECT IDENTITY

- **Project Name:** OlsenBrands Employee Documentation Platform
- **What This Project Is:** A Next.js 15 web app (`olsenbrands.com`) serving two audiences: (1) new employees completing a guided onboarding flow — signing docs, uploading permits, downloading required apps, filling a feedback survey; (2) Jordan (the owner) managing employees and their documents via a password-protected HQ admin hub.
- **Primary Objective:** Replace paper-based onboarding across all 7 OlsenBrands businesses with a fully digital, photo-verified, per-business system — starting with Wedgie's as the pilot.
- **Strategic Intent:** Centralize employee recordkeeping across Subway, FiiZ, Wedgie's, and On Chord Academy. This is the internal ops backbone for a multi-location restaurant/business portfolio. Eventually connects to Shift Check (accountability app) and TonicBase (music school CRM).
- **Hard Constraints:**
  - **No mock data** — ever. All data comes from Supabase. No stubs, seeds, or placeholders unless Jordan explicitly asks.
  - **Supabase service role key must NEVER reach the browser.** All DB writes go through Next.js API routes (server-side only).
  - **Signed URLs are generated on demand, never stored.** 1-hour TTL, created fresh at render time.
  - **One dynamic `[business-slug]` route covers all businesses.** Zero per-business code duplication.
  - **HQ routes are protected by middleware** checking `hq-auth` cookie === `'authenticated'`. Don't bypass or reimplment this.
  - **Vercel auto-deploy is unreliable for this project.** Always force-deploy with `npx vercel --prod --yes` after pushing to main. Never assume a push = live deployment.
  - **Branch prefix:** `steve/`. Git identity: `olsenbrands@users.noreply.github.com`.
  - **HQ aesthetic:** bg `#0f0f0f`, cream `#efe5cd`, accent red `#c9533c`.

---

### 2. WHAT EXISTS RIGHT NOW

**Built and working:**
- `/hq/employees` — HQ employee list page (server component): summary stats, business/status/name filters via URL params, clickable rows
- `/hq/employees/[id]` — Employee profile: per-business doc sections, status badges, fresh signed URLs (1hr), IP audit trail
- `/hq/layout.tsx` — HQ nav with Employees link (Users icon)
- `/[business-slug]/page.tsx` — Dynamic public business landing page (name, location, type badge, breadcrumb, Employees card)
- `/[business-slug]/employees/page.tsx` — Employee hub (Onboarding active; Training/Docs/Schedules = coming soon cards)
- `/[business-slug]/onboarding/page.tsx` — Full 6-step onboarding flow (see Architecture section)
- `/api/onboarding/[slug]` — GET: returns business + documentTypes ordered by `display_order`
- `/api/onboarding/[slug]/submit` — POST: creates employee + signature document record + generates signed PDF
- `/api/onboarding/[slug]/upload` — POST: handles file upload to Supabase Storage
- `/api/onboarding/[slug]/survey` — POST: stores survey in DB, conditionally sends Resend email if `RESEND_API_KEY` set
- Wedgie's: logo (`/logos/wedgies.jpg`), `welcome_copy` in DB, 6 document requirements at correct `display_order`
- HQ password: `5421` (from `HQ_PASSWORD` Vercel env var)
- Claw Fix skill installed at `~/clawd/skills/claw-fix/SKILL.md`

**Partially built:**
- `/[business-slug]/employees/page.tsx` — Onboarding section works, but Training/Documentation/Schedules sections are "coming soon" stubs
- Remaining 6 businesses have NO `welcome_copy`, `logo_url`, or logo images set yet

**Broken or blocked:**
- HQ browser login issue: Jordan reports `5421` still not working in browser despite `curl` confirming the API works. Likely culprits: stale `hq-auth` cookie, redirect loop, or browser cache. **Not yet confirmed resolved** — Jordan hasn't reported back after the hard-clear-cookies fix was suggested.
- Vercel auto-deploy: GitHub push to `main` does not reliably trigger deployment. Must use `npx vercel --prod --yes` manually every time.
- Resend email on survey: No `RESEND_API_KEY` configured in Vercel env yet — survey submissions store in DB but don't email Jordan. Graceful fallback is in place.
- Claw Fix skill reference files missing: `SKILL.md` references `references/state-machine.md`, `references/doc-templates.md`, `references/audit-passes.md` — these don't exist yet.

**Not started yet:**
- `welcome_copy` and `logo_url` for Subway (3 locations), FiiZ (3 locations), On Chord Academy
- Logo image files for all businesses other than Wedgie's
- Full build-out of employee hub (`/[business-slug]/employees`) — Training, Documentation, Schedules
- Shift Check integration (separate project, future)
- Pending security tickets: rotate exposed TonicBase Supabase JWT; fix Supabase security vulns across 6 projects

---

### 3. ARCHITECTURE & TECHNICAL MAP

**Tech stack:**
- **Frontend/Backend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL) — project ref `cdywllssnbcdehtrjcqb`
- **Storage:** Supabase Storage — bucket `employee-documents` (private, signed URLs)
- **Hosting:** Vercel (auto-deploy unreliable — force deploy manually)
- **PDF generation:** (existing API route logic — generates signed policy PDFs)
- **Email (survey):** Resend — conditional on `RESEND_API_KEY` env var

**Repo:** `/Users/macminim4/Developer/olsen-brands/`
**Live URL:** `https://olsenbrands.com`

**Key DB tables:**
| Table | Purpose |
|-------|---------|
| `businesses` | All 7 OlsenBrands businesses. Columns: `id`, `name`, `slug`, `type`, `location`, `welcome_copy`, `logo_url` |
| `document_types` | Types of docs/steps. Columns: `id`, `name`, `slug`, `description`, `step_type`, `requires_signature`, `requires_file_upload`, `requires_form_fill`, `current_version`, `content`, `content_url`, `app_store_url`, `play_store_url` |
| `business_document_requirements` | Join: which docs each business requires + ordering. Columns: `id`, `business_id`, `document_type_id`, `display_order` |
| `employees` | Created on first signature. Columns include `first_name`, `last_name`, `email`, `business_id`, `status` |
| `employee_documents` | Records of completed signature/upload steps. Includes `employee_id`, `document_type_id`, `signed_at`, `file_path`, `ip_address` |
| `onboarding_surveys` | Survey responses: `employee_id`, `business_id`, `employee_name`, `business_slug`, `rating`, `was_clear`, `feedback`, `created_at` |

**Wedgie's business ID:** `67c2ac49-32a6-476a-98ed-cc1dfc7fe25e`

**`step_type` values and what they render:**
- `signature` — scroll-to-unlock policy + SignaturePad component
- `file_upload` — drag/tap file upload zone
- `informational` — styled content card + "Got it →" button (no DB record created)
- `app_download` — description + App Store button + Google Play button + "I've downloaded it →" button (no DB record created)
- `survey` — star rating + yes/no clarity question + open textarea → POST to survey API

**Wedgie's 6-step flow (display_order 1–6):**
1. `toast-banking-setup` — informational (doc type ID: `c73da435-f5da-4513-880e-9ebb7e114d6a`)
2. `employee-policy-acknowledgment` — signature
3. `food-handlers-permit` — file_upload
4. `mytoast-app` — app_download (doc type ID: `60af3dec-fe39-4bbd-ab43-d770493a62fd`)
5. `band-app` — app_download (doc type ID: `cba421ac-c94f-40fc-a60e-a138e05c9400`)
6. `onboarding-survey` — survey (doc type ID: `4a291cb9-77bb-4c91-a146-51bc7ee1e0fc`)

**How onboarding works end-to-end:**
1. Employee navigates to `olsenbrands.com/[slug]/onboarding`
2. Page client-fetches `GET /api/onboarding/[slug]` → returns `business` + `documentTypes[]` ordered by `display_order`
3. Identity step: employee enters first name, last name, email → advances to document step
4. For each doc step: renders based on `step_type`. Informational/app_download = advance only (no DB record). Signature = POST `/submit`. File upload = POST `/upload`. Survey = POST `/survey`.
5. Employee record created on first `POST /submit` (signature step). `employeeId` stored in React state, passed to subsequent steps.
6. After last step: complete screen shown.

**Supabase access pattern:**
- Server components: import from `src/lib/supabase.ts` (uses `SUPABASE_SERVICE_ROLE_KEY`)
- API routes: same
- Client components: never touch Supabase directly — always go through API routes
- Management API (DDL/schema changes): use `security find-generic-password -s "Supabase CLI" -w` to get access token, then `curl` the Management API

**Key files:**
```
src/
  app/
    hq/
      layout.tsx                          # HQ shell nav
      employees/
        page.tsx                          # Employee list (server component)
        components/EmployeeFilters.tsx    # Debounced filters (client component)
        [id]/page.tsx                     # Employee profile (server component)
    [business-slug]/
      page.tsx                            # Business landing page
      employees/page.tsx                  # Employee hub (coming soon stubs)
      onboarding/page.tsx                 # Full onboarding flow (client component)
    api/
      auth/login/route.ts                 # Sets hq-auth cookie
      onboarding/[slug]/
        route.ts                          # GET business + docs
        submit/route.ts                   # POST signature
        upload/route.ts                   # POST file upload
        survey/route.ts                   # POST survey
  lib/
    supabase.ts                           # Server-side Supabase client
  middleware.ts                           # Protects /hq/* and /api/hq/*
public/
  logos/
    wedgies.jpg                           # Wedgie's logo (80x80 rounded on identity step)
```

**Naming conventions:**
- Branch: `steve/<task-name>`
- Commits: conventional (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- API routes: `/api/onboarding/[slug]/[action]`
- CSS vars used throughout: `--bg-primary`, `--bg-secondary`, `--border`, `--accent`, `--text-primary`, `--text-secondary`, `--text-muted`

---

### 4. RECENT WORK — WHAT JUST HAPPENED (HIGH PRIORITY)

**What was worked on this session:**
- Built and shipped the full 6-step Wedgie's onboarding experience (branch `steve/onboarding-full-flow`, merged to main)
- Added DB schema: `step_type`, `content_url`, `app_store_url`, `play_store_url` columns to `document_types`; `display_order` to `business_document_requirements`; created `onboarding_surveys` table
- Inserted 4 new document types (Toast Banking, MyToast, Band, Survey) and all 6 Wedgie's requirements with correct ordering
- Built survey API route with conditional Resend email
- Built all 4 new step renderers in `onboarding/page.tsx`: informational, app_download, survey (signature + file_upload were pre-existing)
- Identity step redesigned: logo + welcome heading + brand copy + dynamic step-preview bullets + form
- Added `welcome_copy` and `logo_url` columns to `businesses` table; populated Wedgie's values
- Wedgie's logo (`wedgies.jpg`) added to `public/logos/` and deployed
- All commits on main; force-deployed via `npx vercel --prod --yes`
- Latest prod deployment: 7 min old, status Ready (as of 10:38 PM Feb 27)

**Key decisions made this session and WHY:**
- **`step_type` column over slug-based rendering:** Cleaner — adding a new business with the same step types requires zero code changes. Slug-based rendering would require updating the switch statement for every new slug.
- **informational/app_download steps skip DB record creation:** These steps have no legal/compliance value to record. `advanceOrComplete(null, null)` just moves the index forward. Keeps `employee_documents` clean.
- **No iframe for MyToast:** X-Frame-Options headers on Toast's site block iframes. App store buttons + description card is the correct approach.
- **Correct Band app links:** Jordan initially provided the wrong Android link (pointed to Toast). Correct links: iOS `https://apps.apple.com/us/app/band/id638415315`, Android `https://play.google.com/store/apps/details?id=com.band.android`
- **Survey email is conditional on `RESEND_API_KEY`:** Avoids hard-blocking deployment on email setup. DB storage always happens; email fires only if the key exists.
- **Employee created on first signature, not on identity submit:** The identity step collects name/email but doesn't write to DB. This avoids orphan employee records from people who start but don't complete. The `employeeId` is set in React state when the first POST `/submit` succeeds.

**What changed in the system:**
- 4 new DB tables/columns (see schema above)
- 4 new document type rows + 6 new business_document_requirements rows (Wedgie's)
- New API route: `survey/route.ts`
- Updated API route: `GET /api/onboarding/[slug]` now returns `step_type`, `app_store_url`, `play_store_url`, `content_url`, `display_order`, ordered by `display_order ASC`
- `onboarding/page.tsx` — complete rewrite of document step section; new state variables (survey); new `handleInformationalAdvance`, `handleSurveySubmit` functions
- `businesses` table: `welcome_copy TEXT`, `logo_url TEXT` columns added; Wedgie's values populated
- `public/logos/wedgies.jpg` added

**Discussed but NOT yet implemented:**
- Adding `RESEND_API_KEY` to Vercel env so survey emails actually fire
- Adding `welcome_copy`, `logo_url` and logo images for the other 6 businesses
- Investigating and fixing the Vercel auto-deploy webhook

**Open threads:**
- HQ browser login — Jordan hasn't confirmed if the hard-clear-cookies fix resolved it
- Band app Android link — double-check `play_store_url` in DB is `com.band.android` not the Toast app link Jordan originally provided

---

### 5. WHAT COULD GO WRONG

**Known bugs / issues:**
- HQ browser login: `POST /api/auth/login` works via curl (`{"success":true}`) but Jordan reports browser login failure. Likely stale cookie or redirect loop. Fix: hard-clear cookies for `olsenbrands.com`, retry in incognito. Middleware checks exact string: `hqAuthCookie?.value === 'authenticated'`.
- Survey email silently skipped: if Jordan adds `RESEND_API_KEY` to Vercel, he'll need to redeploy (not just set the env). The conditional check fires at runtime, so redeployment is required for the env var to take effect.
- Band Android link in DB: Jordan originally sent the wrong link (Toast app). Verify `play_store_url` for `cba421ac-c94f-40fc-a60e-a138e05c9400` is `https://play.google.com/store/apps/details?id=com.band.android`.

**Edge cases to watch:**
- Employee goes through informational/app_download steps before reaching signature — `employeeId` is null. The upload step checks `if (!selectedFile || !employeeId)` — if somehow a business configured upload before signature, upload would silently fail. Current Wedgie's config has signature first, so this won't fire, but watch for other businesses.
- `display_order` conflicts: if two requirements for the same business have the same `display_order`, sort order is undefined. Always assign distinct values.
- `searchParams` and `params` in Next.js 15 are Promises — must be awaited in server components. This is already handled; don't revert it.

**Technical debt / shortcuts:**
- `onboarding/page.tsx` is a large monolithic client component (~650 lines). Works well but could eventually be split into per-step sub-components. Don't refactor unless asked.
- The file upload description text is hardcoded: `"Upload a photo or PDF of your valid Food Handler's Permit..."` — this works for Wedgie's but won't be accurate for other businesses with different file upload types. Should use `activeDoc.description` instead. Low priority.

**Assumptions that could be wrong:**
- Assumes `employee-documents` Supabase Storage bucket exists and is private. If it was deleted or renamed, signed URLs will silently fail.
- Assumes `businesses` rows exist with the correct `slug` value for each URL. If a business slug in the DB doesn't match the URL, the onboarding page will show "Link not found."
- Assumes `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are set in Vercel production env. If these are missing, all API routes silently return 500.

---

### 6. HOW TO THINK ABOUT THIS PROJECT

**1. Core architectural pattern:**
Server components for reads, API routes for writes, client components only for interactivity. The `[business-slug]` dynamic routing is the backbone — one file, zero per-business code. The `step_type` column in `document_types` drives all rendering logic. Adding a new business means DB rows only, no code changes.

**2. Most common mistake a new person would make:**
Writing per-business conditional logic in the UI (`if (slug === 'wedgies') { ... }`). This defeats the entire architecture. Everything must be driven by data — `step_type`, `display_order`, `app_store_url`, etc. The UI is a generic renderer; the DB is the configuration.

**3. What looks like it should be refactored but shouldn't be:**
`onboarding/page.tsx` looks like it should be broken into separate step components. Don't do it without being asked. The monolithic structure keeps all state in one place, which is important because steps share state (employeeId, firstName, lastName, email flow from identity → document steps). Splitting it introduces prop-drilling or context complexity with no real benefit at current scale.

---

### 7. DO NOT TOUCH LIST

- **Do NOT refactor `onboarding/page.tsx` into sub-components** unless Jordan explicitly asks.
- **Do NOT redesign the `[business-slug]` routing architecture.** It's intentionally generic.
- **Do NOT add per-business conditional logic to UI components.** Drive everything from DB columns.
- **Do NOT use Supabase client in browser/client components.** Service role key stays server-side.
- **Do NOT store signed URLs in the database.** Generate them fresh at render time only.
- **Do NOT commit directly to `main`.** Branch: `steve/<task-name>` → merge → push → force deploy.
- **Do NOT assume Vercel auto-deployed after a push.** Always run `npx vercel --prod --yes`.
- **Do NOT introduce new npm packages** without confirming with Jordan.
- **Do NOT seed or generate mock data** under any circumstances.
- **Do NOT change the HQ middleware or auth cookie logic** unless explicitly asked.
- **Do NOT change the `display_order` values** for existing Wedgie's requirements without Jordan's approval.

---

### 8. CONFIDENCE & FRESHNESS

| Section | Confidence | Notes |
|---------|-----------|-------|
| DB schema (businesses, document_types, business_document_requirements, onboarding_surveys) | ✅ HIGH | Built and verified this session |
| Wedgie's 6-step flow and DB data | ✅ HIGH | Inserted and verified this session |
| `onboarding/page.tsx` full implementation | ✅ HIGH | Written and deployed this session |
| API routes (submit, upload, survey) | ✅ HIGH | Written and deployed this session |
| HQ employees pages (/hq/employees, /hq/employees/[id]) | ✅ HIGH | Built last session, verified live |
| Dynamic business landing pages (/[business-slug]) | ✅ HIGH | Built last session, verified live |
| Vercel deployment status | ✅ HIGH | Force-deployed, 7m old, Ready |
| HQ browser login issue | ⚠️ MEDIUM | API confirmed working via curl; browser behavior not re-verified after fix suggested |
| Other businesses' DB data (Subway, FiiZ, On Chord) | ⚠️ MEDIUM | Businesses exist in DB; no welcome_copy/logo_url/doc requirements added yet |
| Band app Android link in DB | ⚠️ MEDIUM | Correct link was written in code but should verify what's actually in DB |
| Supabase Storage bucket state | ❓ LOW | Assumed to exist and be private; not re-verified this session |
| Resend email integration | ❓ LOW | Code is written; no API key configured; never tested end-to-end |

---

*Generated: February 27, 2026 at 22:38 MST by Steve (Clawdbot)*
*Repo: /Users/macminim4/Developer/olsen-brands/*
*Live: https://olsenbrands.com*
