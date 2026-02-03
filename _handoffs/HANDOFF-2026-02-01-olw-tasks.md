# HANDOFF: Operation Little Wiggles — Mobile Task List
**Date:** 2026-02-01 23:33 MST
**Agent:** Steve
**Branch:** main (clean)
**Last Commit:** af634a2

---

## 1. Project Identity

- **Project:** Olsen Brands Management Hub (olsen-brands)
- **Repo:** /Users/macminim4/Developer/olsen-brands
- **Live URL:** https://olsen-brands.vercel.app
- **OLW Section:** https://olsen-brands.vercel.app/operation-little-wiggles
- **OLW Tasks:** https://olsen-brands.vercel.app/operation-little-wiggles/tasks
- **OLW Password:** victory2026
- **Stack:** Next.js 16.1.6 (Turbopack), React, Tailwind CSS, Framer Motion, Lucide React
- **Hosting:** Vercel (jordan-olsens-projects-0f81341a)
- **Deploy command:** `cd /Users/macminim4/Developer/olsen-brands && npx vercel --prod --yes`
- **Git identity (this repo):**
  ```
  git config user.name "Jordan Olsen"
  git config user.email "olsenbrands@users.noreply.github.com"
  ```

## 2. Jordan's Hard Rules

- **NO mock data, ever.** All data must be dynamic from a single source of truth. Mock data confuses AI builders into thinking features are complete.
- **`trash` > `rm`** — recoverable beats gone forever
- **Never commit directly to `main`** — feature branches only (`steve/<task-name>`)
- **Run pre-merge check** before every merge: `bash ~/clawd/scripts/pre-merge-check.sh /Users/macminim4/Developer/olsen-brands`
- **Ask before any external/destructive action**
- **Never send emails without passcode + approval**
- **Build must pass** before merging: `npm run build`

## 3. Workspace Conventions

- **Branch workflow:** `git checkout main && git pull → git checkout -b steve/<name> → work → commit → checkout main → merge → push → delete branch`
- **Commit style:** Conventional (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- **Confidence rule:** ≥90% → merge + notify Jordan. <90% → send preview URL, explain concerns, wait for approval.
- **After every push:** Check Vercel deployment status. If deploy fails, fix immediately.

## 4. Architecture Overview

### Auth System
- **Middleware:** `src/middleware.ts` — intercepts all `/operation-little-wiggles/*` routes
- **Login page:** `src/app/operation-little-wiggles/login/page.tsx`
- **Auth API:** `src/app/api/olw/auth/route.ts` — POST with `{"password":"victory2026"}`, sets `olw-auth` cookie (30-day, httpOnly, secure, sameSite=lax)
- **Important:** Login uses `window.location.href` (hard redirect) NOT `router.push()` — the middleware only runs on server requests, so client-side nav skips auth check

### OLW Layout
- **File:** `src/app/operation-little-wiggles/layout.tsx`
- Provides: top bar (hamburger + 🐛 OLW branding + compact date/time), sidebar nav, mobile overlay
- **Sidebar nav items:** Dashboard, Tasks, Missions, Brainstorm + "Back to OBM"
- **Theme:** Victory theme — light background (#f4fafb), teal (#2bbede) + red (#ff0000) accents, DM Sans font
- Header was recently compacted for mobile — date/time condensed to `Sun, Feb 1 · 10:43 PM`

### OLW Pages

| Route | File | Status |
|-------|------|--------|
| `/operation-little-wiggles` | `page.tsx` | Dashboard — overview with stats, team, projects, quick actions |
| `/operation-little-wiggles/tasks` | `tasks/page.tsx` | **NEW** — Mobile-first task list (the focus of tonight's work) |
| `/operation-little-wiggles/missions` | `missions/page.tsx` | Original kanban board (4 columns) — kept as archive |
| `/operation-little-wiggles/brainstorm` | `brainstorm/page.tsx` | 3 seeded insights |
| `/operation-little-wiggles/login` | `login/page.tsx` | Password entry |

### Tasks Page (the main deliverable)
- **File:** `src/app/operation-little-wiggles/tasks/page.tsx`
- **UX:**
  - 3 status tabs at top: To Do | Doing | Done (with count badges)
  - Vertical card list — compact cards with priority dot, title, category icon, chevron
  - Tap to expand → shows description, meta tags, action buttons (Start Working / Mark Done / Move Back)
  - Drag-and-drop reordering via framer-motion `Reorder.Group` + `Reorder.Item` with `useDragControls`
  - Drag handle: GripVertical icon on left side of each card
  - FAB (floating action button) bottom-right → opens bottom sheet (mobile) or modal (desktop) to create tasks
  - Create form: title, description, assignee (Jordan/Jimmy), priority, category
- **Data:** Client-side only (React useState). 8 initial tasks hardcoded. No API/DB yet.
- **Layout:** Uses `h-[calc(100vh-64px)]` to fit viewport. Task list area is `flex-1 overflow-y-auto`.

## 5. Current State

### What's Built & Working
- ✅ Auth system (password login, cookie, middleware redirect)
- ✅ OLW layout with sidebar nav and compact mobile header
- ✅ Tasks page with 3-tab status system
- ✅ Expandable task cards with status change buttons
- ✅ Drag-and-drop reordering (framer-motion Reorder)
- ✅ FAB + create task bottom sheet / modal
- ✅ Dashboard, Missions (old kanban), Brainstorm pages

### What's NOT Built Yet
- ❌ No API/database — tasks are client-side state only, reset on refresh
- ❌ No task editing (only create + status change)
- ❌ No task deletion
- ❌ No persistence (needs Supabase or similar)
- ❌ Settings page (placeholder only)
- ❌ No due dates on tasks
- ❌ No notifications/reminders

### Known Issues
- Task data resets on page refresh (no persistence)
- The old Missions page (`/missions`) still exists with the same hardcoded data — intended as archive until Tasks is proven
- Middleware warning: `"middleware" file convention is deprecated. Please use "proxy" instead.` — cosmetic, still works

## 6. Git Status

```
Branch: main (clean)
Latest commits:
af634a2 fix: use hard redirect after OLW login so middleware sees cookie
6f22048 fix: compact OLW header for mobile viewport
1b4c1c2 feat: compact task cards with drag-and-drop reordering
07ed52d feat: add mobile-first task list page for OLW
ab0c5da fix(olw): disable auto-capitalize on password field
d0ac0bd feat(olw): add show/hide password toggle on login
7be9453 feat: add Operation Little Wiggles mission control hub
```

Working tree is CLEAN — no uncommitted changes.

## 7. Task Data (8 tasks)

| ID | Title | Assignee | Priority | Category | Status |
|----|-------|----------|----------|----------|--------|
| olw-1 | Choose Option A or B — Mac Mini vs Manual Claude | Jimmy | High | Business | todo |
| olw-2 | Purchase Mac Mini M4 (if Option A) | Jimmy | High | Business | todo |
| olw-3 | Register VictoryBioLabs.com domain | Jimmy | High | Website | todo |
| olw-4 | Register VictoryHeadshots.com domain | Jimmy | Medium | Website | todo |
| olw-5 | Set up Stripe account for BioLabs | Jimmy | High | Business | todo |
| olw-6 | Define VictoryHeadshots.com pages and content | Jimmy | Medium | Design | todo |
| olw-7 | Establish entity separation plan | Jordan | High | Legal | todo |
| olw-8 | Build Operation Little Wiggles hub | Jordan | High | Website | doing |

## 8. Key File Locations

```
src/
  app/
    api/olw/auth/route.ts          — Auth endpoint
    operation-little-wiggles/
      layout.tsx                     — OLW shell (sidebar, header, auth wrapper)
      page.tsx                       — Dashboard
      login/page.tsx                 — Login page
      tasks/page.tsx                 — ⭐ Mobile-first task list (MAIN FOCUS)
      missions/page.tsx              — Old kanban board (archive)
      brainstorm/page.tsx            — Ideas & research
  middleware.ts                      — Route protection
```

## 9. Context: Who Is This For?

**Jimmy** — Jordan's business partner in the Victory Peptides project. Tech novice. This tool needs to be dead simple — no searching for how to create tasks, no complex gestures. The tasks page is his daily driver for tracking what needs to get done.

**The Victory Project** includes:
- VictoryPeptides.com (active)
- VictoryBioLabs.com (planning — must stay SEPARATE from VictoryPeptides)
- VictoryHeadshots.com (planning — photography brochure site)

## 10. Jordan's Feedback From Tonight

1. ✅ "Needs to fully fit on the screen" → Fixed with compact cards + viewport height
2. ✅ "Tasks need to be dragged up and down" → Added framer-motion drag-and-drop
3. ✅ "More narrow, still off screen" → Compacted header (smaller padding, condensed date/time)
4. 🔧 Login wasn't working in Safari → Fixed with hard redirect instead of router.push
5. Jordan wants this to **replace the kanban concept** — vertical list with status tabs, not horizontal columns

## 11. Next Steps

### Immediate (what Jordan likely wants next)
1. **Verify login works on Safari/iPhone** — Jordan reported it wasn't working, fix was deployed but needs confirmation
2. **Add task persistence** — Currently resets on refresh. Options:
   - Supabase (matches other OBM projects)
   - localStorage (quick win, no server needed)
   - Ask Jordan which approach
3. **Add task editing** — Tap into expanded card should allow editing title/description
4. **Add task deletion** — Swipe left or trash icon in expanded view
5. **Move Dashboard/Brainstorm to "Under Construction"** — Jordan wants focus on task list only

### Future
- Due dates and reminders
- Push notifications
- Settings page
- Activity feed
- Transition from `/missions` (old kanban) to `/tasks` as the default landing page

### How to Start Working
1. `cd /Users/macminim4/Developer/olsen-brands`
2. `git status` — should be clean on main
3. `npm run dev` — starts on localhost (check which port)
4. Open browser to the OLW tasks page
5. Create a feature branch: `git checkout -b steve/<task-name>`
6. Make changes, test on mobile viewport (375px), build, merge, deploy
