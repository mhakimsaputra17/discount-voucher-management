# Discount Voucher Management System — Product Requirements Document (PRD)

> Format: Markdown (`.md`).  
> Audience: Product, Engineering (FE/BE), QA.  
> Source brief: Take-home assignment describing a simple full-stack app for internal staff to manage discount vouchers.

---

## 1) Problem Statement

Internal staff need a lightweight tool to create, view, edit, delete, import, and export discount vouchers quickly and safely. The tool must be easy to use, enforce basic data integrity (unique code, percent range), and support small teams without complex setup.

## 2) Objectives & Success Criteria

**Objectives**
- Provide CRUD flows for vouchers with clear validation and feedback.
- Allow bulk import via CSV and export all data to CSV.
- Keep authentication simple (dummy token) while demonstrating guarded endpoints.

**Success Criteria**
- Staff can complete Create → List → Edit → Delete without backend errors.
- Import: preview parses, invalid rows flagged; valid rows inserted.
- Export: downloads a CSV matching the required schema.
- List view supports search by code, sorting by `expiry_date` and `discount_percent`, and pagination.

## 3) In Scope / Out of Scope

**In Scope**
- FE: Login (dummy), Voucher List, Create/Edit form, optional CSV Upload with preview, Export button, basic UX polish (loading states, toasts, clear nav).
- BE: Dummy auth, voucher CRUD, CSV upload endpoint (parse + persist + per-row result), export endpoint (stream CSV).

**Out of Scope**
- Real authentication/authorization, role management, audit logs, multi-tenanting, i18n, advanced filtering/analytics, soft delete, rate limiting, concurrency controls beyond simple constraints.

## 4) Users & Roles

- **Internal Staff (single role):** Full access to voucher management features once “logged in” (dummy).

## 5) User Stories

1. **Login (dummy)**  
   As staff, I enter email/password and, upon success, I receive a token saved locally so I can access the app.
2. **Browse vouchers**  
   I view a paginated table with search and sorting so I can find vouchers fast.
3. **Create voucher**  
   I can add a voucher with unique code, % between 1–100, and a valid expiry date.
4. **Edit voucher**  
   I can update a voucher using the same form, seeing current values populated.
5. **Delete voucher**  
   I can remove a voucher with a confirmation step and see immediate feedback.
6. **Upload CSV (bonus)**  
   I can upload a CSV, preview parsed rows, fix issues, then import; I get per-row success/failure results.
7. **Export CSV**  
   I can download all vouchers in the specified CSV format for external processing.

## 6) Functional Requirements

### 6.1 Frontend (Next.js or Vite + React)

- **Tech**: React (TypeScript recommended), fetch via `fetch`/`axios`, state via local component state or lightweight store.
- **Storage**: Save dummy token in `localStorage` or cookie after login.
- **Routing**:  
  - `/login`  
  - `/vouchers` (list)  
  - `/vouchers/new` (create)  
  - `/vouchers/:id/edit` (edit)  
  - `/vouchers/upload` (optional bonus)
- **Login Page**
  - Inputs: `email`, `password` (no real validation with backend; any non-empty OK).
  - On submit: call `POST /login`, store token, redirect to `/vouchers`.
- **Voucher List Page**
  - Table columns: `No`, `Voucher Code`, `Discount (%)`, `Expiry Date`, `Actions(Edit/Delete)`.
  - Controls:
    - “Create New Voucher” → `/vouchers/new`
    - Search by voucher code (client or server side).
    - Sorting by `expiry_date` and `discount_percent`.
    - Pagination (client or server).
    - “Export” → triggers `GET /vouchers/export` file download.
  - Loading indicators for fetch; empty-state message; error toasts on failure.
- **Create/Edit Voucher Page**
  - Fields & validation:
    - **Voucher Code**: required, unique (server-validated).
    - **Discount Percent**: required, numeric, integer 1–100.
    - **Expiry Date**: required (date picker), must be a valid date.
  - Shared form component for create/edit modes.
  - Actions: **Save**, **Cancel**.
  - Show inline validation errors and toast success/failure.
- **CSV Upload Page (Bonus)**
  - Upload a `.csv` with schema: `voucher_code,discount_percent,expiry_date`.
  - Client-side parse/preview (optional) or preview from server parse response.
  - Show row-level validation results before final commit (ideal flow).
  - Submit to backend; display per-row success/failure after import.
- **UX**
  - Loading spinners during fetch/submit.
  - Toasts for success/error.
  - Clear topbar/sidebar nav (e.g., links to List, Create, Upload, Logout).

### 6.2 Backend (Golang API)

- **Tech**: Go (Gin/Echo/Fiber), persistence using any simple DB (SQLite/Postgres/MySQL).  
- **Auth (Dummy)**
  - `POST /login` → returns a fixed token (e.g., `"123456"`).
  - Protected routes require `Authorization: Bearer 123456` (or custom header).
  - Middleware validates token presence & value.
- **Voucher CRUD**
  - `GET /vouchers`  
    - Returns list; support `?q=` (search by code), `?sort=expiry_date|discount_percent`, `?order=asc|desc`, `?page=1`, `?limit=10`.  
    - Response includes `data` and, if server-paginated, `pagination` meta (page, limit, total, total_pages* if available).
  - `POST /vouchers`  
    - Body: `{ voucher_code, discount_percent, expiry_date }`.
    - Validations: required fields; code unique; percent 1–100; `expiry_date` parseable (ISO `YYYY-MM-DD` preferred).
  - `PUT /vouchers/:id`  
    - Same validations; uniqueness excludes the same record.
  - `DELETE /vouchers/:id`
- **CSV Upload**
  - `POST /vouchers/upload-csv` (multipart/form-data, file field: `file`).
  - Server parses and validates each row:
    - Schema: `voucher_code,discount_percent,expiry_date`.
    - Return summary: `{ total_rows, success_count, failure_count, failures: [{row, reason}] }`.
- **CSV Export**
  - `GET /vouchers/export`  
    - Streams CSV with header `voucher_code,discount_percent,expiry_date` for **all** vouchers.

\*If server cannot compute `total_pages` cheaply, return `total` only; FE can degrade gracefully.

## 7) Data Model

**Voucher**
- `id` (UUID or auto-increment)
- `voucher_code` (string, unique, indexed)
- `discount_percent` (int, 1–100)
- `expiry_date` (date)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Constraints**
- Unique index on `voucher_code`.
- Check constraint on `discount_percent` (1–100).
- `expiry_date` must be a valid date (no timezone needed; treat as local date).

## 8) CSV Specifications

**Header (required, lower-case):**
```
voucher_code,discount_percent,expiry_date
```

**Example Rows:**
```
WELCOME10,10,2025-12-31
FLASH50,50,2025-10-31
```

**Validation Rules**
- Missing columns or header mismatch ⇒ file rejected with clear error.
- Per-row:
  - `voucher_code`: non-empty, unique (reject duplicates vs DB; optionally dedupe within file).
  - `discount_percent`: integer 1–100.
  - `expiry_date`: parseable as `YYYY-MM-DD`.
- Response includes per-row results; failures should include the row number (1-based excluding header) and reason.

## 9) API Contract (Examples)

### Auth
```
POST /login
Body: { "email": "any", "password": "any" }
200: { "token": "123456" }
```

Header for protected routes:
```
Authorization: Bearer 123456
```

### List (with search/sort/pagination)
```
GET /vouchers?q=FLASH&sort=expiry_date&order=asc&page=1&limit=10
200: {
  "data": [
    { "id": 1, "voucher_code": "FLASH50", "discount_percent": 50, "expiry_date": "2025-10-31" }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 23, "total_pages": 3 }
}
```

### Create
```
POST /vouchers
Body: {
  "voucher_code": "WELCOME10",
  "discount_percent": 10,
  "expiry_date": "2025-12-31"
}
201: { "id": 123, ...same fields... }
400: { "error": "voucher_code already exists" }
```

### Update
```
PUT /vouchers/123
Body: { "discount_percent": 15, "expiry_date": "2025-12-31" }
200: { "id": 123, "voucher_code": "WELCOME10", "discount_percent": 15, "expiry_date": "2025-12-31" }
```

### Delete
```
DELETE /vouchers/123
204: (no content)
```

### Upload CSV
```
POST /vouchers/upload-csv (multipart)
200: {
  "total_rows": 5,
  "success_count": 4,
  "failure_count": 1,
  "failures": [{ "row": 3, "reason": "voucher_code already exists" }]
}
```

### Export CSV
```
GET /vouchers/export
200: text/csv stream with required header
```

## 10) Validation & Error Handling

- FE validates required fields and numeric range; BE is the source of truth (returns 4xx with messages).
- Duplicate code → 409 Conflict (or 400 with message).
- Bad CSV format → 400 with detailed reason (missing column, wrong header, invalid value).
- Auth missing/invalid → 401 Unauthorized.
- FE surfaces errors via toast and inline field messages.

## 11) Pagination Strategy

- **Server-side preferred** for realism:
  - Query params: `page`, `limit`; default `page=1`, `limit=10/20`.
  - Return `total` and, if feasible, `total_pages`.
- **Fallback (client-side)** allowed for very small datasets.

## 12) Sorting & Search

- Search: `q` filters `voucher_code` (case-insensitive, partial match).
- Sorting: `sort=expiry_date|discount_percent`, `order=asc|desc`.
- Default sort: `expiry_date asc` (or created_at desc—team can choose one; document in FE).

## 13) Security & Compliance (Lightweight)

- Dummy token `"123456"` not secure—only for exercise.
- Use HTTPS in production settings (not required for local assignment).
- Sanitize file upload handling; set CSV size limit (e.g., 2–5 MB).

## 14) Performance & Scalability (Basic)

- Index `voucher_code`.
- Stream CSV export to avoid high memory usage.
- Batch insert on CSV import when possible.

## 15) Non-Functional Requirements

- **Reliability**: CRUD and import/export flows must not crash on malformed input.
- **Usability**: Visible loading states, empty states, consistent toasts.
- **Maintainability**: Separate layers (handlers/service/repo), typed DTOs.

## 16) Navigation & IA

- Topbar with: **Vouchers**, **Create**, **Upload** (bonus), **Export**, **Logout**.
- Breadcrumbs on form pages (optional).

## 17) Acceptance Criteria (QA Checklist)

- Login stores token; protected routes blocked without token.
- List shows correct columns; search filters by code; sorting works by both fields; pagination navigates pages.
- Create/Edit enforce required fields and % range; duplicate codes are rejected.
- Delete asks confirm; row disappears after success.
- Export downloads CSV with correct header and all rows.
- Upload accepts `.csv`, rejects others; returns per-row results; success count matches inserted rows.
- All network actions display loading and success/error toasts.

## 18) Risks & Mitigations

- **CSV header/order mismatch** → Strict header check + clear error.
- **Time formats** → Enforce `YYYY-MM-DD`.
- **Duplicate codes in the same file** → Detect within file before insert; report both collisions (in-file and vs DB).

## 19) Delivery, Timeline, & Deliverables

- **Deadline**: **2×24 hours** from assignment receipt.
- **Deliverables**
  - Public GitHub repository link (FE + BE, README with setup steps).
  - Minimal seed or migration scripts.
  - This PRD (`README_PRD.md`) at repo root.
- **README must include**
  - Tech stack & versions.
  - Setup & run commands for FE and BE.
  - .env examples (e.g., API base URL, token).
  - API docs (summarized) and sample curl commands.

## 20) Example Data (Optional)

Seed a few vouchers:
```
WELCOME10,10,2025-12-31
MIDYEAR15,15,2025-06-30
FLASH50,50,2025-10-31
```

---

*End of PRD.*
