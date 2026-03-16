## 1. Backend — Data model and migration

- [ ] 1.1 Add Candidate model to backend/prisma/schema.prisma (firstName, lastName, email unique, phone, address, education Json, workExperience Json, cvFilePath, createdAt)
- [ ] 1.2 Run prisma migrate dev to create migration (ensure Docker/PostgreSQL is up and DATABASE_URL in .env)
- [ ] 1.3 Create backend uploads directory (e.g. backend/uploads/cvs) and add to .gitignore

## 2. Backend — Candidates API (create and file upload)

- [ ] 2.1 Add multer dependency and create upload middleware (destination, 5 MB limit, file filter for PDF/DOCX only)
- [ ] 2.2 Create candidates route module: POST /api/candidates with multipart parsing, validate required fields and email format, check duplicate email (409), persist candidate and save CV with sanitized filename
- [ ] 2.3 Add JSON body parser and mount candidates routes in backend/src/index.ts; ensure API error middleware returns JSON (400/409/500) with consistent shape
- [ ] 2.4 Implement GET /api/candidates/education/suggestions and GET /api/candidates/experience/suggestions (return distinct values from Candidate JSON or empty array)
- [ ] 2.5 Document all three endpoints in Swagger/OpenAPI (request/response, validation rules, error responses)

## 3. Backend — Tests

- [ ] 3.1 Backend integration/unit tests: POST create success (201), validation errors (400 missing required, invalid email), duplicate email (409), invalid file type/size (400), 500 handling without leaking internals
- [ ] 3.2 Backend tests for GET suggestions endpoints (200, empty or non-empty array)

## 4. Frontend — Routing and dashboard

- [ ] 4.1 Add react-router-dom; configure routes in App.tsx (e.g. / or /dashboard for dashboard, /candidates/new for add-candidate form)
- [ ] 4.2 Create recruiter dashboard page (e.g. frontend/src/pages/dashboard.tsx or components/dashboard) with visible, accessible "Add candidate" button/link linking to /candidates/new
- [ ] 4.3 Add dashboard styles (e.g. Dashboard.module.scss) per project SCSS conventions

## 5. Frontend — Add-candidate form and API client

- [ ] 5.1 Create API client (e.g. frontend/src/api/candidates.ts): createCandidate(formData: FormData), getEducationSuggestions(q?), getExperienceSuggestions(q?) using REACT_APP_API_URL or proxy
- [ ] 5.2 Create AddCandidateForm component (frontend/src/components/add-candidate-form/AddCandidateForm.tsx) with react-hook-form and Controller: fields for firstName, lastName, email, phone, address, dynamic education/experience blocks, CV file input (accept PDF/DOCX)
- [ ] 5.3 Add client-side validation schema (required fields, email format, file type/size); display validation messages on blur and submit
- [ ] 5.4 Create useAddCandidate hook: submit multipart FormData, handle loading/success/error state, map API errors to user-facing messages
- [ ] 5.5 Add add-candidate page (e.g. frontend/src/pages/add-candidate.tsx) that renders AddCandidateForm and shows success confirmation or error message after submit
- [ ] 5.6 Co-locate AddCandidateForm.module.scss; ensure form is responsive and uses semantic HTML, ARIA, and keyboard navigation

## 6. Frontend — Autocomplete and polish

- [ ] 6.1 Optional: implement useEducationSuggestions and useExperienceSuggestions hooks and wire to form fields (dropdown or combobox) when API returns suggestions
- [ ] 6.2 Optional: add error boundary around add-candidate page or form
- [ ] 6.3 Verify focus management and aria-describedby for validation errors; test keyboard flow

## 7. Frontend — Tests

- [ ] 7.1 Frontend test: add-candidate form renders required fields and submit button
- [ ] 7.2 Frontend test: submit calls API with correct payload (e.g. mock fetch) and success shows confirmation or error shows message

## 8. Documentation

- [ ] 8.1 Update README with "Add candidate" flow: how to open from dashboard, CV format (PDF/DOCX) and size limit, REACT_APP_API_URL if used
- [ ] 8.2 Ensure Swagger/OpenAPI is up to date and readable for candidates endpoints
