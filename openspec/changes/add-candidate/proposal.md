## Why

Recruiters need a way to register candidates in the LTI ATS so they can manage talent data and run selection processes. Today there is no candidate entity or add-candidate flow; adding this capability is the first step toward full candidate management.

## What Changes

- **Recruiter dashboard**: A main dashboard page with a visible, accessible "Add candidate" entry point (button or link).
- **Add-candidate form**: A multi-section form (personal data, contact, address, education entries, work experience entries, CV upload) with client- and server-side validation, PDF/DOCX upload, success confirmation, and clear error messages.
- **Candidates API**: New backend endpoints to create a candidate (multipart form + file), store CV, and optionally serve autocomplete suggestions for education and work experience.
- **Data model**: New `Candidate` model in Prisma (and optionally `Education` / `WorkExperience`), with CV stored on disk or referenced in DB; unique email per candidate.
- **Docs & tests**: README section for the flow; Swagger/OpenAPI for new endpoints; backend and frontend tests for validation and happy path.

**Non-goals (for this change)**

- Candidate list or detail views, editing, or deletion.
- Authentication/authorization (recruiter identity or roles).
- Parsing or indexing CV content; only storage and link to candidate.

## Capabilities

### New Capabilities

- `candidates-api`: REST API to create candidates (POST with multipart), store CV (PDF/DOCX), and return education/experience suggestions (GET). Documented in Swagger; validation and error responses (400/409/500).
- `add-candidate-ui`: Recruiter dashboard with "Add candidate" entry and add-candidate page (form with validation, file upload, confirmation, error handling). Responsive, accessible (semantic HTML, ARIA, keyboard).

### Modified Capabilities

- _(None; no existing specs in `openspec/specs/`.)_

## Impact

- **Backend**: New Prisma models and migration; new routes under `/api/candidates`; multer (or equivalent) for file upload; JSON error middleware for API.
- **Frontend**: New routes (dashboard, add-candidate); new components and hooks (form, API client); possible new deps (e.g. react-router-dom, react-hook-form).
- **Docs**: README, OpenAPI/Swagger.
- **Tests**: Backend integration/unit tests for create and validation; frontend tests for form and submit.
