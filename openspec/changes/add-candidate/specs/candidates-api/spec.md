## ADDED Requirements

### Requirement: Create candidate with optional CV

The system SHALL expose a POST endpoint to create a candidate. The request MUST be multipart/form-data with fields for candidate data and an optional file for the CV. The system MUST validate required fields (firstName, lastName, email) and email format on the server. The system MUST accept CV files only in PDF or DOCX format and MUST reject other file types with 400. The system MUST enforce a maximum CV file size (e.g. 5 MB). On success the system SHALL return 201 and the created candidate (id and safe metadata; no full CV content in response). The system SHALL persist the CV file on disk and store the file path on the candidate record.

#### Scenario: Successful create with all fields

- **WHEN** client sends POST /api/candidates with valid multipart body (firstName, lastName, email, optional phone, address, education JSON, workExperience JSON, optional cvFile PDF/DOCX within size limit)
- **THEN** system creates the candidate in the database, stores the CV file, and responds with 201 and JSON body including candidate id and persisted fields (no cvFile content)

#### Scenario: Successful create without CV

- **WHEN** client sends POST /api/candidates with valid required fields and no cvFile
- **THEN** system creates the candidate with cvFilePath null and responds with 201

#### Scenario: Validation error missing required field

- **WHEN** client sends POST /api/candidates with missing firstName, lastName, or email
- **THEN** system responds with 400 and JSON body with field-level error messages (e.g. errors.email)

#### Scenario: Validation error invalid email format

- **WHEN** client sends POST /api/candidates with email that is not a valid email format
- **THEN** system responds with 400 and JSON body indicating invalid email

#### Scenario: Duplicate email

- **WHEN** client sends POST /api/candidates with email that already exists for another candidate
- **THEN** system responds with 409 and a clear message (e.g. "Candidate with this email already exists")

#### Scenario: Invalid file type for CV

- **WHEN** client sends POST /api/candidates with a file that is not PDF or DOCX (e.g. .txt or wrong content-type)
- **THEN** system responds with 400 and a message indicating allowed types (PDF, DOCX)

#### Scenario: CV file too large

- **WHEN** client sends POST /api/candidates with cvFile exceeding the maximum size (e.g. 5 MB)
- **THEN** system responds with 400 and a message indicating size limit

#### Scenario: Server or storage error

- **WHEN** an unexpected error occurs (e.g. database unavailable, disk write failure) during create
- **THEN** system responds with 500 and a generic user-facing message; internal details MUST NOT be exposed in the response

---

### Requirement: Education suggestions for autocomplete

The system SHALL expose a GET endpoint that returns suggestions for education (e.g. institution or degree) based on existing candidate data. The endpoint MAY accept a query parameter (e.g. q) to filter suggestions. The response MUST be JSON with a list of strings (e.g. suggestions array). The system MAY return an empty array when there is no data.

#### Scenario: Get education suggestions with query

- **WHEN** client sends GET /api/candidates/education/suggestions?q=foo
- **THEN** system responds with 200 and JSON body containing a suggestions array of strings matching existing education data (or empty array)

#### Scenario: Get education suggestions without query

- **WHEN** client sends GET /api/candidates/education/suggestions
- **THEN** system responds with 200 and JSON body containing a suggestions array (e.g. all distinct values or empty)

---

### Requirement: Work experience suggestions for autocomplete

The system SHALL expose a GET endpoint that returns suggestions for work experience (e.g. company or role) based on existing candidate data. The endpoint MAY accept a query parameter (e.g. q) to filter suggestions. The response MUST be JSON with a list of strings. The system MAY return an empty array when there is no data.

#### Scenario: Get experience suggestions with query

- **WHEN** client sends GET /api/candidates/experience/suggestions?q=bar
- **THEN** system responds with 200 and JSON body containing a suggestions array of strings matching existing experience data (or empty array)

#### Scenario: Get experience suggestions without query

- **WHEN** client sends GET /api/candidates/experience/suggestions
- **THEN** system responds with 200 and JSON body containing a suggestions array (or empty)

---

### Requirement: Candidates API documented in OpenAPI/Swagger

All candidates endpoints (POST create, GET education suggestions, GET experience suggestions) SHALL be documented in the project's OpenAPI/Swagger spec. Documentation MUST include request/response shapes, validation rules (required fields, email format, file types, size limit), and error responses (400, 409, 500).

#### Scenario: OpenAPI spec includes candidates endpoints

- **WHEN** a developer or tool reads the project's Swagger/OpenAPI definition
- **THEN** the definition includes the three candidates endpoints with described parameters, bodies, and responses
