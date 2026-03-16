## ADDED Requirements

### Requirement: Recruiter dashboard with Add candidate entry

The system SHALL provide a recruiter dashboard view that is the main landing after entering the app (e.g. route / or /dashboard). The dashboard MUST include a clearly visible button or link to add a new candidate (e.g. "Add candidate"). The entry MUST be keyboard accessible and MUST have appropriate ARIA or semantic labeling so assistive technologies can identify it. The entry MUST navigate the user to the add-candidate form (e.g. /candidates/new).

#### Scenario: User opens dashboard and sees Add candidate entry

- **WHEN** user navigates to the dashboard route
- **THEN** the page displays a visible "Add candidate" button or link

#### Scenario: User activates Add candidate from dashboard

- **WHEN** user clicks or activates the "Add candidate" control
- **THEN** the application navigates to the add-candidate form route

#### Scenario: Add candidate entry is keyboard accessible

- **WHEN** user focuses the "Add candidate" control via keyboard (e.g. Tab)
- **THEN** the control can be activated with Enter or Space and focus is visible

---

### Requirement: Add-candidate form with all required fields

The system SHALL present a form for adding a candidate that includes: first name, last name, email (required); phone, address (optional); one or more education entries (institution, degree, field, startDate, endDate); one or more work experience entries (company, role, startDate, endDate, description); and an optional CV file upload (PDF or DOCX). The form MAY be split into sections (e.g. personal, contact, address, education, experience, CV). The form MUST use controlled inputs or react-hook-form with validation. Client-side validation SHALL run on blur and on submit; required fields MUST not be empty and email MUST match a valid format. The UI SHALL display clear, user-facing validation messages (e.g. inline or summary). Copy and messages MAY support EN/ES per project conventions.

#### Scenario: Form displays all required and optional fields

- **WHEN** user is on the add-candidate form page
- **THEN** the form includes inputs for firstName, lastName, email, phone, address, at least one education block, at least one work experience block, and CV file input

#### Scenario: Client-side validation on submit

- **WHEN** user submits the form with empty required field (e.g. email)
- **THEN** the form does not submit and the UI shows a validation message for that field

#### Scenario: Client-side validation for email format

- **WHEN** user enters an invalid email format and blurs the field or submits
- **THEN** the form shows a validation message indicating invalid email format

#### Scenario: CV file type restriction in UI

- **WHEN** user selects a file that is not PDF or DOCX (e.g. file input accept attribute or client check)
- **THEN** the UI indicates that only PDF or DOCX are allowed (e.g. accept attribute or error message)

---

### Requirement: Submit add-candidate form and show outcome

The form SHALL submit data as multipart/form-data to POST /api/candidates (or configured API base). On success (201), the UI MUST show a clear confirmation message that the candidate was added successfully; the UI MAY redirect to dashboard or candidate list. On error (400, 409, 500 or network failure), the UI MUST display an appropriate user-facing message (e.g. validation errors per field, "Candidate with this email already exists", "Something went wrong. Please try again."). The system SHALL NOT expose stack traces or internal error details to the user. Loading state (e.g. disabled submit, spinner) SHOULD be shown while the request is in progress.

#### Scenario: Successful submit shows confirmation

- **WHEN** user submits the form with valid data and the API returns 201
- **THEN** the UI shows a confirmation message that the candidate was successfully added and MAY navigate away

#### Scenario: Validation error from server displayed to user

- **WHEN** the API returns 400 with field-level errors
- **THEN** the UI displays the error messages (e.g. next to fields or in a summary) so the user can correct the data

#### Scenario: Duplicate email error displayed

- **WHEN** the API returns 409 (duplicate email)
- **THEN** the UI displays a clear message (e.g. "A candidate with this email already exists")

#### Scenario: Network or server error displayed

- **WHEN** the request fails (network error or 500)
- **THEN** the UI displays a generic, user-friendly message (e.g. "Something went wrong. Please try again.") and does not expose internal details

---

### Requirement: Optional autocomplete for education and experience

The add-candidate form MAY provide autocomplete or suggestion dropdowns for education (e.g. institution, degree) and work experience (e.g. company, role) using GET /api/candidates/education/suggestions and GET /api/candidates/experience/suggestions. When the API returns suggestions, the UI MAY show them in a list for the user to select; when the API returns an empty array or errors, the UI SHALL still allow free text entry.

#### Scenario: Education suggestions displayed when available

- **WHEN** user focuses or types in an education-related field and the suggestions API returns non-empty suggestions
- **THEN** the UI MAY show a list of suggestions the user can select from, while still allowing free text

#### Scenario: Experience suggestions displayed when available

- **WHEN** user focuses or types in an experience-related field and the suggestions API returns non-empty suggestions
- **THEN** the UI MAY show a list of suggestions the user can select from, while still allowing free text

---

### Requirement: Add-candidate UI accessibility and compatibility

The add-candidate flow (dashboard entry and form) MUST use semantic HTML (e.g. form, label, input, button). Interactive elements MUST be keyboard operable and MUST have visible focus indicators. ARIA attributes SHALL be used where needed (e.g. aria-label, aria-describedby for errors, aria-invalid). The layout MUST be responsive and work on common browsers (Chrome, Firefox, Safari, Edge) and on typical mobile viewports. Error messages MUST be associated with the relevant fields (e.g. aria-describedby) for screen readers.

#### Scenario: Form is keyboard navigable

- **WHEN** user navigates the add-candidate form using only the keyboard
- **THEN** all form controls can be reached and activated in a logical order and focus is visible

#### Scenario: Validation errors are announced

- **WHEN** validation fails and error messages are shown
- **THEN** errors are programmatically associated with the relevant fields (e.g. aria-describedby or aria-errormessage) so assistive technologies can announce them

#### Scenario: Responsive layout on small viewport

- **WHEN** user opens the add-candidate form on a narrow viewport (e.g. mobile)
- **THEN** the form remains usable (readable and operable without horizontal scroll for core content)
