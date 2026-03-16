**User**

Make sure to read @README.md  and update @openspec/config.yaml to include more details and also including Project conventions, Domain context Important contraints and External dependencies

---

**Cursor**


Updating `openspec/config.yaml` with README details and the requested sections.



Updated `openspec/config.yaml` using the README. Summary of changes:

- **Tech stack**  
  - Clarified where code lives (e.g. `frontend/src`, `backend/src`, `backend/prisma`, `backend/.env`) and that API docs use Swagger and the DB is PostgreSQL via Prisma.

- **Domain context**  
  - Set project name: **LTI — Talent Tracking System (Sistema de Seguimiento de Talento)**.  
  - Stated purpose (talent tracking/follow-up) and that the app is a React SPA plus Express REST API.

- **Project conventions**  
  - Kept Plan/Act and React/backend conventions.  
  - Added: keep `backend/` and `frontend/` layout, don’t mix client/server code.  
  - Noted that project docs/README are bilingual (EN/ES).

- **Important constraints**  
  - Backend port **3010**, frontend **3000**.  
  - PostgreSQL must be running before the backend; config via `.env`.  
  - Run order: Docker/PostgreSQL → backend (build then dev) → frontend (build then start).  
  - Do not commit `.env`; use env vars for DB URL and secrets.

- **External dependencies**  
  - Node.js and npm.  
  - Docker and Docker Compose for PostgreSQL in development.  
  - PostgreSQL (Docker defaults: localhost:5432, user/postgres, DB name e.g. mydatabase; real values from `.env`).  
  - Optional: PostgreSQL client for direct DB access.

**Rules** were adjusted to mention the LTI domain, EN/ES in specs when relevant, and to call out Docker/PostgreSQL and `.env` in tasks where needed.

---

**User**

Review also all cursor rules available on @.cursor/ to enhance the @openspec/config.yaml 

---

**Cursor**


Updating the OpenSpec config to include conventions from all Cursor rules.



Summary of what was pulled from `.cursor/rules` into `openspec/config.yaml`:

**Project conventions**
- Plan/Act workflow: full plan in plan mode; mention of Memory Bank and reusing existing patterns.

**Frontend conventions (from Cursor rules)**
- **Components**: function components, typed props (PascalCase interfaces), named exports, `.tsx`; directories `lowercase-with-dashes`.
- **Hooks**: top-level only; custom hooks for reuse; hooks/utils in `.ts`.
- **State**: Zustand for global state; lift state before Context; Context for tree-wide sharing.
- **Forms**: controlled components; custom hooks for simple forms; react-hook-form + `<Controller>` for complex; client vs server validation; optional Joi (or similar).
- **Styling**: SCSS modules co-located (`.module.scss`); variables, mixins, `&`; partials in `styles/index.scss`; camelCase or BEM; minimal global styles.
- **Performance**: less client-only state/effects; lazy loading (React.lazy/Suspense, images); useMemo/React.memo; no inline handlers in JSX; tree-shaking-friendly structure.
- **React practices**: refs only for DOM; error boundary; effect cleanup; guard clauses for errors.
- **Accessibility**: semantic HTML, ARIA, keyboard navigation.
- **Code style**: Standard.js (2 spaces, single quotes, no semicolons, `===`/`!==`, camelCase/PascalCase); functional/declarative; descriptive names (e.g. `isLoading`, `hasError`); file order: component → subcomponents → hooks → static.
- **TypeScript**: strict mode; explicit return/object types; avoid `@ts-ignore`/`@ts-expect-error`.
- **Error handling**: validate early, happy path last, clear user messages, log unexpected errors.

**Backend**
- Validation and clear errors; logging of unexpected errors (aligned with Error Handling rule).

**External dependencies**
- Optional frontend deps: react-hook-form, Joi (or similar), Zustand.

**Rules section**
- **Proposal**: Respect Plan/Act and Memory Bank.
- **Specs**: Specify state (Zustand/Context/local), forms, validation, SCSS; include a11y and error handling in UI/API specs.
- **Tasks**: Follow naming and file layout; prefer existing patterns and review codebase first.

---

**User**

/enrich-us Add Candidate to the System:
As a recruiter,
I want to have the ability to add candidates to the ATS system,
So that I can manage their data and selection processes efficiently.

Acceptance Criteria:

Function accessibility: There must be a clearly visible button or link to add a new candidate from the main page of the recruiter dashboard.

Data entry form: When selecting the option to add a candidate, a form must be presented that includes the necessary fields to capture the candidate’s information such as first name, last name, email, phone, address, education, and work experience.

Data validation: The form must validate the entered data to ensure it is complete and correct. For example, the email must have a valid format and required fields must not be empty.

Document upload: The recruiter must have the option to upload the candidate’s CV in PDF or DOCX format.

Addition confirmation: Once the form is completed and the information is submitted, a confirmation message must appear indicating that the candidate has been successfully added to the system.

Errors and exception handling: In case of an error (for example, a failure in the connection with the server), the system must display an appropriate message to the user informing them of the problem.

Accessibility and compatibility: The functionality must be accessible and compatible with different devices and web browsers.

Notes:

The interface must be intuitive and easy to use to minimize the training time required for new recruiters.

Consider the possibility of integrating autocomplete functionalities for the education and work experience fields, based on preexisting data in the system.

Technical Tasks:

Implement the user interface for the add candidate form.

Develop the backend necessary to process the information entered in the form.

Ensure the security and privacy of the candidate’s data.

---

**Cursor**


Analyzing the user story and enriching it with technical detail. Gathering project documentation and architecture context.



Checking for existing API patterns and frontend routing:



Here is the enriched user story you can paste into Jira or use as the single source of truth. The story was provided directly, so no Jira MCP was used.

---

# Add Candidate to the System — Enriched ticket

---

## [original]

**Title:** Add Candidate to the System

**User Story:**  
As a recruiter,  
I want to have the ability to add candidates to the ATS system,  
So that I can manage their data and selection processes efficiently.

**Acceptance Criteria:**
- Function accessibility: There must be a clearly visible button or link to add a new candidate from the main page of the recruiter dashboard.
- Data entry form: When selecting the option to add a candidate, a form must be presented that includes the necessary fields to capture the candidate's information such as first name, last name, email, phone, address, education, and work experience.
- Data validation: The form must validate the entered data to ensure it is complete and correct. For example, the email must have a valid format and required fields must not be empty.
- Document upload: The recruiter must have the option to upload the candidate's CV in PDF or DOCX format.
- Addition confirmation: Once the form is completed and the information is submitted, a confirmation message must appear indicating that the candidate has been successfully added to the system.
- Errors and exception handling: In case of an error (for example, a failure in the connection with the server), the system must display an appropriate message to the user informing them of the problem.
- Accessibility and compatibility: The functionality must be accessible and compatible with different devices and web browsers.

**Notes:**
- The interface must be intuitive and easy to use to minimize the training time required for new recruiters.
- Consider the possibility of integrating autocomplete functionalities for the education and work experience fields, based on preexisting data in the system.

**Technical Tasks:**
- Implement the user interface for the add candidate form.
- Develop the backend necessary to process the information entered in the form.
- Ensure the security and privacy of the candidate's data.

---

## [enhanced]

### 1. Full description of functionality

- From the recruiter dashboard main page, the recruiter can open an “Add candidate” flow.
- A multi-section form is shown: personal data, contact, address, education (one or more entries), work experience (one or more entries), and CV upload (PDF or DOCX).
- Client-side validation runs on blur and on submit; server-side validation runs on API request. Invalid or missing required data is reported with clear, user-facing messages.
- CV is uploaded as a file (PDF or DOCX only); the server stores it (path or blob per implementation) and links it to the candidate.
- On success, the UI shows a clear confirmation and optionally redirects to the candidate list or detail; on failure (network, validation, server error), a specific error message is shown.
- The flow is responsive, uses semantic HTML and ARIA, and supports keyboard navigation (project a11y standards).

---

### 2. Data model and fields to be updated/created

**Candidate (new entity)**  
Stored in DB and sent in request body (except file and computed fields):

| Field              | Type     | Required | Validation / notes                                      |
|--------------------|----------|----------|---------------------------------------------------------|
| `firstName`        | string   | Yes      | Non-empty, max length (e.g. 100)                        |
| `lastName`         | string   | Yes      | Non-empty, max length (e.g. 100)                        |
| `email`            | string   | Yes      | Valid email format, unique per candidate                |
| `phone`            | string   | No       | Optional; format validation if present                 |
| `address`          | string   | No       | Optional; max length (e.g. 500)                         |
| `education`        | array    | No       | List of education entries (see below)                  |
| `workExperience`   | array    | No       | List of experience entries (see below)                 |
| `cvFile`           | file     | No       | PDF or DOCX; max size (e.g. 5 MB); sent as multipart   |
| `cvFileName`       | string   | No       | Original filename; set by backend from upload          |
| `createdAt`        | datetime | —        | Set by backend on create                                |

**Education entry (embedded or separate table):**

- `institution`, `degree`, `field`, `startDate`, `endDate` (all optional; define max lengths).

**Work experience entry (embedded or separate table):**

- `company`, `role`, `startDate`, `endDate`, `description` (all optional; define max lengths).

**Backend:** Persist `Candidate` (and optionally normalized `Education` / `WorkExperience` tables) via Prisma; store CV file on disk or in object storage and save path or reference in DB. Add any necessary indexes (e.g. unique on `email`).

---

### 3. API: structure and URLs

**Base URL:** `http://localhost:3010` (backend). Frontend uses relative or env-based API base (e.g. `REACT_APP_API_URL`).

| Method | URL                        | Purpose                    | Request body / type     | Response (success)     |
|--------|----------------------------|----------------------------|--------------------------|------------------------|
| `POST` | `/api/candidates`          | Create candidate + upload CV | `multipart/form-data`    | `201` + created candidate (ID, ...) |
| `GET`  | `/api/candidates/education/suggestions?q=`  | Autocomplete education (e.g. institution/degree) | — | `200` + `{ suggestions: string[] }` |
| `GET`  | `/api/candidates/experience/suggestions?q=`| Autocomplete experience (e.g. company/role)       | — | `200` + `{ suggestions: string[] }` |

- **Validation errors:** `400` + JSON body with field-level errors (e.g. `{ "email": "Invalid format" }`).
- **Conflict (e.g. duplicate email):** `409` + message.
- **Server/upload error:** `500` + generic message (no internal details to client).
- Document all endpoints in Swagger/OpenAPI (project standard).

**File upload:** Accept only `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX); reject others with `400`. Enforce max file size (e.g. 5 MB) and sanitize stored filename.

---

### 4. Files to be modified or created (by layer)

**Backend (Node.js, Express, TypeScript, Prisma):**

- `backend/prisma/schema.prisma` — Add `Candidate` model (and optionally `Education` / `WorkExperience`); add relation to CV storage reference if stored in DB.
- `backend/src/routes/candidates.ts` (or equivalent) — Register `POST /api/candidates`, `GET .../education/suggestions`, `GET .../experience/suggestions`; use middleware for multipart (e.g. `multer`) and validation (e.g. Joi or similar).
- `backend/src/index.ts` — Mount candidate routes and JSON body parser; ensure error middleware returns JSON for API routes.
- Optional: `backend/src/controllers/candidatesController.ts`, `backend/src/services/candidateService.ts` — Business logic and Prisma calls; keep routes thin.
- Optional: `backend/src/middleware/upload.ts` — Multer config (destination, limits, file filter for PDF/DOCX).
- Swagger/OpenAPI spec (per project location) — Add definitions for Candidate, education/experience, and the three endpoints above.

**Frontend (React 18, TypeScript, CRA):**

- `frontend/src/App.tsx` — Add routing (e.g. `react-router-dom`): dashboard route, add-candidate route.
- `frontend/src/pages/dashboard.tsx` (or `components/dashboard/`) — Recruiter dashboard with prominent “Add candidate” button/link (visible, accessible).
- `frontend/src/pages/add-candidate.tsx` (or `components/add-candidate-form/`) — Add-candidate page that renders the form and handles submit.
- `frontend/src/components/add-candidate-form/AddCandidateForm.tsx` — Main form component (controlled or react-hook-form with `<Controller>` per project conventions).
- `frontend/src/components/add-candidate-form/AddCandidateForm.module.scss` — Co-located styles (SCSS modules).
- Hooks: e.g. `frontend/src/hooks/useAddCandidate.ts` — Submit logic (multipart), success/error state; optional `useEducationSuggestions`, `useExperienceSuggestions` for autocomplete.
- API client: e.g. `frontend/src/api/candidates.ts` — `createCandidate(formData: FormData)`, optional `getEducationSuggestions(q)`, `getExperienceSuggestions(q)`.
- Optional: Error boundary around the form or page; global error toast/banner for API errors.
- Ensure semantic HTML, ARIA where needed, and keyboard navigation (project a11y rules).

**Documentation / config:**

- `README.md` — Short section on “Add candidate” (how to open the flow, required env for API URL if used).
- OpenAPI/Swagger — As above; keep in sync with backend routes.

---

### 5. Steps for the task to be considered complete

1. **Backend**
   - Add Candidate (and optionally Education/Experience) to Prisma schema; run migration; ensure DB is up (Docker/PostgreSQL).
   - Implement `POST /api/candidates` (multipart: fields + file); validate types, formats, and file type/size; persist candidate and CV; return 201 + created resource.
   - Implement GET suggestions endpoints (can return empty array until autocomplete data exists); document in Swagger.
   - Add global/json error handler for API routes; return 400/409/500 with consistent JSON shape.
2. **Frontend**
   - Add router and routes: dashboard, add-candidate.
   - Dashboard: main page with clear “Add candidate” button/link.
   - Add-candidate form: all fields listed in section 2; client-side validation (required, email format, file type/size); optional autocomplete for education/experience.
   - Submit as `multipart/form-data` to `POST /api/candidates`; on success show confirmation and optionally redirect; on error show message (connection, validation, server).
   - Responsive layout; semantic HTML; ARIA and keyboard accessible.
3. **Quality**
   - Backend: unit/integration tests for validation (invalid email, missing required, file type/size) and for successful create (and optionally suggestions).
   - Frontend: at least one test for form render and one for submit (e.g. mock API).
4. **Documentation**
   - README updated; Swagger/OpenAPI updated and readable.

---

### 6. Documentation and tests

- **README:** Add “Add candidate” under user flows: how to open from dashboard, that CV is PDF/DOCX and max size, and that API base URL is configurable via env if applicable.
- **OpenAPI/Swagger:** Document request/response for `POST /api/candidates` (multipart), both GET suggestion endpoints; include validation rules (required fields, email, file types).
- **Backend tests:** Validation rules (required, email, file type/size); 201 on valid create; 400/409 on invalid or duplicate; 500 handling (e.g. DB down) without leaking internals.
- **Frontend tests:** Add-candidate form renders required fields and submit button; (optional) submit calls API with correct payload; error state shows message.

---

### 7. Non-functional requirements

- **Security and privacy**
  - Do not log or expose full CV contents or PII in responses beyond what is necessary (e.g. return ID and safe metadata).
  - Validate and sanitize all inputs (length, type, file extension/content-type); store files in a non-public directory or object storage with access control.
  - Use env for secrets and DB URL; no credentials in repo.
- **Performance**
  - Limit CV file size (e.g. 5 MB) and consider async processing if parsing CVs later.
  - Autocomplete endpoints: limit result set and response size; add simple caching if needed.
- **Accessibility and compatibility**
  - WCAG-oriented: semantic HTML, ARIA where needed, full keyboard navigation, focus management on success/error.
  - Works on common browsers (Chrome, Firefox, Safari, Edge) and on mobile viewports (responsive layout).
- **Error handling**
  - User-facing messages for validation, duplicate email, and “something went wrong” (no stack traces or internal details in production).

---

Use the **[original]** block as the existing ticket content and the **[enhanced]** section as the detailed refinement. If the ticket was in “To refine”, move it to “Pending refinement validation” after pasting the enriched content. Because the story was provided in chat, Jira was not updated automatically; you can paste this markdown into the Jira description and adjust formatting as needed (Jira supports some markdown and custom formatting).

---

**User**

Give me this on markdown format

---

**Cursor**


The enriched ticket is saved as a markdown file at **`docs/enriched-us-add-candidate.md`**.

You can:
- **Open** `docs/enriched-us-add-candidate.md` in your repo and copy from there.
- **Paste** its contents into Jira (Jira supports basic markdown and tables).

The file includes:
- **\[original]** — The user story and acceptance criteria as you provided them.
- **\[enhanced]** — The refined version with: full description, data model/fields, API URLs, files to change, completion steps, docs/tests, and non-functional requirements, all in markdown (headers, lists, tables).

---

**User**

/opsx-propose @docs/enriched-us-add-candidate.md 

---

**Cursor**


Creating an OpenSpec change from the enriched user story. Reading the doc and checking the OpenSpec setup.



Checking for an OpenSpec CLI and change structure:



Running the OpenSpec CLI to create the change; if it's unavailable, we'll create the change structure manually.



Summary of what was created for the **add-candidate** change from `docs/enriched-us-add-candidate.md`:

---

**Change:** `add-candidate`  
**Location:** `openspec/changes/add-candidate/`

**Artifacts:**

| Artifact | Description |
|----------|-------------|
| **proposal.md** | Why: recruiters need to register candidates. What: dashboard, add-candidate form, candidates API, Prisma model, docs/tests. New capabilities: `candidates-api`, `add-candidate-ui`. Non-goals: list/detail/edit, auth, CV parsing. |
| **design.md** | Context, goals/non-goals, and decisions: Candidate + JSON education/experience, CV on disk, multer, react-hook-form, react-router, API error contract. Risks/trade-offs, migration plan, open questions. |
| **specs/candidates-api/spec.md** | Requirements: create candidate (multipart, validation, file type/size, 201/400/409/500); education/experience suggestions GET; OpenAPI documentation. Scenarios for each. |
| **specs/add-candidate-ui/spec.md** | Requirements: dashboard with visible “Add candidate” entry; form with all fields and client validation; submit and success/error handling; optional autocomplete; accessibility and compatibility. Scenarios for each. |
| **tasks.md** | 8 groups: (1) Prisma + migration + uploads dir, (2) multer + POST/GET routes + Swagger, (3) backend tests, (4) router + dashboard, (5) API client + form + validation + hook + page + SCSS, (6) autocomplete + error boundary + a11y, (7) frontend tests, (8) README + Swagger. Checkbox format for tracking. |

---

All artifacts are complete and the change is **ready for implementation**.

Run **`/opsx-apply`** (or ask to implement) to start working through the tasks.

---