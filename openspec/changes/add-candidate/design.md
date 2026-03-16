## Context

LTI is a talent tracking system (ATS) with a React frontend and Express/Prisma backend. There is no candidate entity yet; the backend exposes a single root route and the frontend is the default CRA app. This change introduces the first candidate-management flow: recruiters add candidates via a dashboard entry point and a form that posts to a new API, with CV upload and optional autocomplete. Backend runs on port 3010, frontend on 3000; PostgreSQL is required (Docker).

## Goals / Non-Goals

**Goals:**

- Enable recruiters to add candidates from a dedicated UI (dashboard + form).
- Persist candidate data and CV (PDF/DOCX) via a REST API; validate input on client and server; return clear success/error responses.
- Optional autocomplete for education and work experience from existing data.
- Document new endpoints in Swagger; keep README and tests aligned.

**Non-Goals:**

- Candidate list, detail, edit, or delete.
- Authn/authz; parsing or indexing CV content.
- Mobile app or other clients beyond the existing SPA.

## Decisions

1. **Candidate data model (Prisma)**  
   - Single `Candidate` model with scalar fields (firstName, lastName, email, phone, address, cvFilePath, createdAt). Education and work experience stored as JSON arrays on Candidate (simpler migration, good enough for v1).  
   - **Alternative considered:** Normalized `Education` and `WorkExperience` tables with relations. Deferred to avoid extra migrations and joins until we need querying/filtering by those entities.

2. **CV storage**  
   - Store files on disk under a dedicated directory (e.g. `backend/uploads/cvs/`), path saved in `Candidate.cvFilePath`. Directory excluded from git and served only via controlled API if needed later.  
   - **Alternative considered:** Object storage (S3). Deferred; can switch later with a single service change.

3. **File upload (backend)**  
   - Use `multer` for multipart parsing: single file field `cvFile`, max size 5 MB, accept only PDF and DOCX (by MIME). Reject others with 400. Sanitize stored filename (e.g. `{candidateId}-{sanitizedOriginalName}`) to avoid path traversal and collisions.

4. **Form handling (frontend)**  
   - Use `react-hook-form` with `<Controller>` for the add-candidate form (complex, multi-section, dynamic education/experience blocks). Client-side validation with a schema (e.g. zod or yup) for required fields and email format; server-side validation remains authoritative.

5. **Routing (frontend)**  
   - Add `react-router-dom`. Two routes: `/` or `/dashboard` for recruiter dashboard (with "Add candidate" CTA), `/candidates/new` for the add-candidate form. No auth guards in this change.

6. **API error contract**  
   - All API responses JSON. Validation errors: 400 with `{ "errors": { "field": "message" } }`. Duplicate email: 409 with `{ "message": "..." }`. Server/upload errors: 500 with generic message only (no stack traces or internals in response).

## Risks / Trade-offs

- **[Risk] JSON education/experience limits querying** → Mitigation: Accept for v1; if we need filtering by institution/company later, add normalized tables and a migration.
- **[Risk] CVs on disk don’t scale across instances** → Mitigation: Single server for now; document that moving to object storage is the scale path.
- **[Risk] No auth: anyone can hit the API** → Mitigation: Explicit non-goal; add auth in a follow-up change.
- **[Trade-off] Autocomplete can return empty** → Acceptable; endpoints return `[]` until we have data; UI shows suggestions only when non-empty.

## Migration Plan

1. Add Prisma models and run `prisma migrate dev` (DB must be up via Docker).
2. Deploy backend (new routes + multer); ensure uploads directory exists and is writable.
3. Deploy frontend (new routes and form); ensure `REACT_APP_API_URL` or proxy points to backend.
4. No data migration; new feature only. Rollback: revert code and optionally drop new tables if needed (no production data in this change).

## Open Questions

- Final location for Swagger spec (single file under `backend/` or generated from JSDoc); align with existing project pattern.
- Whether to add a simple health or readiness check that verifies DB + upload directory for ops.
