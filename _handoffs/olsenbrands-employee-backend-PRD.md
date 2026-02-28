# PRD: OlsenBrands Employee Documentation Platform
**Version:** 1.0  
**Created:** 2026-02-24  
**Owner:** Jordan Olsen / Olsen Brands Management LLC  
**Status:** Pre-Build — Approved for Development

---

## 1. Vision

OlsenBrands.com is the central hub for all Olsen Brands Management businesses. The Employee Documentation Platform is the first major operational module — a system that allows employees across any OBM business to complete onboarding paperwork, sign policies, and upload required documents from their phone, while giving ownership a single, centralized admin view of all employee records across all locations.

**This is not a one-restaurant solution.** It is a multi-business, multi-document, future-proof infrastructure layer that will grow alongside the OBM portfolio.

---

## 2. The Problem

- Employee paperwork is currently paper-based, untracked, and not centralized
- Jordan cannot easily verify who has signed what, at which location, or when
- There is no scalable way to add new document requirements (food permits, I-9s, etc.) without building something new each time
- There is no audit trail for compliance

---

## 3. Businesses (Initial)

| Business | Type | Location |
|---|---|---|
| Wedgie's | Fast casual / salads | Clinton, UT |
| Subway - Kaysville | Franchise | Kaysville, UT |
| Subway - Ogden | Franchise | Ogden, UT (Walmart) |
| Subway - Morgan | Franchise | Morgan, UT |
| FiiZ - Clinton | Franchise | Clinton, UT |
| FiiZ - East Kaysville | Franchise | Kaysville, UT |
| FiiZ - West Kaysville | Franchise | West Kaysville, UT |

New businesses can be added with a single database row — no code changes required.

---

## 4. Core Concepts

### Businesses
Each OBM location is registered in the system with a name, slug (URL-safe), type, and location. Each business has its own public-facing onboarding URL but shares a unified admin backend.

### Employees
Employees are global records. A single employee can be associated with multiple businesses (e.g., someone who works at Wedgie's and FiiZ). Their profile consolidates all documents across all locations.

### Document Types
Document requirements are defined centrally and can be assigned to any business. Examples:
- Employee Policy Acknowledgment (signature required)
- Food Handler Permit (file upload required)
- Government-Issued ID (file upload required)
- Emergency Contact Form (form fill required)
- I-9 Employment Eligibility (form + file upload)
- W-4 Tax Withholding (form fill required)

Adding a new document type requires one database row + one UI component — no architectural changes.

### Employee Documents
The actual submissions — linking an employee, a document type, a business, and the submitted content (signature, file, or form data). Every submission is timestamped and versioned.

---

## 5. User Stories

### Employee
- As an employee, I visit my restaurant's onboarding URL on my phone
- I enter my name and email to identify myself
- I see a checklist of documents required by my employer
- I complete them one by one (sign policies, upload photos of permits, etc.)
- I can download a copy of anything I've signed
- I receive confirmation when my onboarding is complete
- If my employer updates a policy, I am notified and can re-sign

### Admin (Jordan / Ownership)
- As an admin, I visit `/hq/employees` on OlsenBrands.com
- I see all employees across all businesses in one table
- I can filter by business, document completion status, or hire date
- I click any employee to see their full profile with every submitted document
- I can download PDFs of signed policies
- I can see who is missing required documents at a glance
- I receive a notification when an employee completes their onboarding

---

## 6. Technical Architecture

### Stack
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Backend/Database:** Supabase (Postgres) — project `cdywllssnbcdehtrjcqb`
- **File Storage:** Supabase Storage (private bucket: `employee-documents`)
- **PDF Generation:** `@react-pdf/renderer` (server-side, generated on submission)
- **Signature:** `react-signature-canvas` (touch + mouse, saves as PNG)
- **Auth:** Supabase Auth (employees: magic link or open form; admins: existing OBM auth)
- **Hosting:** Vercel

### Database Schema

```sql
-- All OBM businesses
CREATE TABLE businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,        -- e.g. "wedgies", "fiiz-clinton"
  type text,                        -- "restaurant", "drinks", "franchise"
  location text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Employees (global, not per-business)
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Which businesses an employee works at
CREATE TABLE employee_businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  hire_date date,
  active boolean DEFAULT true,
  UNIQUE(employee_id, business_id)
);

-- Types of documents that can be required
CREATE TABLE document_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,               -- "Employee Policy Acknowledgment"
  slug text UNIQUE NOT NULL,        -- "employee-policy"
  description text,
  requires_signature boolean DEFAULT false,
  requires_file_upload boolean DEFAULT false,
  requires_form_fill boolean DEFAULT false,
  current_version text DEFAULT '1.0',
  content text,                     -- policy text (for signature docs)
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Which document types a business requires
CREATE TABLE business_document_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  document_type_id uuid REFERENCES document_types(id) ON DELETE CASCADE,
  required boolean DEFAULT true,
  UNIQUE(business_id, document_type_id)
);

-- Actual employee submissions
CREATE TABLE employee_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  document_type_id uuid REFERENCES document_types(id) ON DELETE CASCADE,
  version text,                     -- which version of the doc they signed
  status text DEFAULT 'pending',    -- pending, complete, expired, rejected
  signature_url text,               -- Supabase Storage URL for signature PNG
  file_url text,                    -- Supabase Storage URL for uploaded file
  pdf_url text,                     -- Supabase Storage URL for generated PDF
  form_data jsonb,                  -- for free-form fields
  signed_at timestamptz,
  expires_at timestamptz,           -- for permits with expiration dates
  ip_address text,                  -- for audit trail
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### URL Structure

**Public (employee-facing):**
- `/wedgies/onboarding` — Wedgie's employee onboarding portal
- `/fiiz/onboarding` — FiiZ employee onboarding portal
- `/subway/onboarding` — Subway employee onboarding portal
- (Each resolves dynamically from the `businesses` slug)

**Admin (HQ):**
- `/hq/employees` — All employees, all businesses
- `/hq/employees/[id]` — Individual employee profile
- `/hq/businesses` — Manage businesses and their document requirements
- `/hq/documents` — Manage document types and policy content

### File Storage Structure
```
employee-documents/
  {employee_id}/
    signatures/
      {document_id}.png
    uploads/
      {document_id}-{filename}
    pdfs/
      {document_id}.pdf
```

---

## 7. Security Considerations

- All files stored in a **private** Supabase Storage bucket — not publicly accessible
- Admin routes protected behind OBM authentication
- Employee onboarding pages are open (link-based) for simplicity — employees don't need accounts
- IP address logged on all submissions for audit trail
- PDF includes timestamp, name, IP, and document version for legal validity

---

## 8. Phase Breakdown

### Phase 1 — Foundation (Database + Seed Data)
Set up all tables, storage bucket, and seed the 7 businesses and initial document types.

### Phase 2 — Wedgie's Onboarding Page (Proof of Concept)
Build the employee-facing onboarding page for Wedgie's. Policy sign, signature pad, PDF generation, save to Supabase.

### Phase 3 — HQ Admin Hub
Build the centralized admin view at `/hq/employees`. View all employees, filter by business, download documents, see completion status.

### Phase 4 — Multi-Business Expansion
Apply the onboarding template to all 7 businesses. Add notification when employee completes. Admin management UI for adding new document types.

### Phase 5 — Advanced Features (Future)
- Document expiration tracking + renewal reminders
- Employee email notifications
- Additional document types (food permits, I-9, emergency contacts)
- Manager-level access (below owner)
- Spanish language support

---

## 9. Decisions Log

| # | Question | Decision | Date |
|---|----------|----------|------|
| 1 | Employee identification method | **Name + email only — no account, no password** | 2026-02-24 |
| 2 | Re-signing on policy updates | **Yes — notify employees via email + flag in HQ backend** | 2026-02-24 |
| 3 | Notification for incomplete onboarding | **Yes — employees who haven't filled out anything should be notified** | 2026-02-24 |
| 4 | Admin notification on completion | **Email + HQ backend** | 2026-02-24 |
| 5 | Admin role scope | **Jordan + Jennifer only for now** | 2026-02-24 |
| 6 | Language support | **English only** | 2026-02-24 |
| 7 | Document expiration tracking | Deferred to Phase 5 | 2026-02-24 |

---

## 10. Notification Architecture

### Employee Notifications (outbound to employees)
- **Onboarding reminder:** When an employee is added to the system and has not completed required documents, send a reminder email with their onboarding link
- **Re-sign notice:** When a policy is updated to a new version, email all employees who signed the previous version with a link to re-sign
- **Completion confirmation:** When an employee completes all required documents, send a confirmation email with PDF download link

### Admin Notifications (inbound to Jordan/Jennifer)
- **New completion:** When any employee completes onboarding, flag in HQ and optionally send email
- **HQ dashboard:** Shows count of employees with incomplete documents at a glance — "3 employees have missing items"
- **Outstanding items list:** Sortable list of who is missing what, per business

---

*This document should be updated as decisions are made and phases are completed.*
