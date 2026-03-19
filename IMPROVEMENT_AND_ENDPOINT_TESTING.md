# Improvement And Endpoint Testing Guide

## Purpose

This document describes:

- the current state of the implemented backend
- the most important improvements to make next
- how to test every currently mounted API endpoint in a reliable order
- which gaps are expected to fail until the codebase is improved

This guide is based on the code currently present in the repository, not on the older README claims.

## Current Implemented Backend Surface

The Express app currently mounts these route groups:

- `/api/departments`
- `/api/degrees`
- `/api/branches`
- `/api/years`
- `/api/semesters`
- `/api/subjects`

At the moment, each of these route groups exposes only:

- `GET /`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

There are no mounted `GET /:id` endpoints yet.

The frontend API documentation mentions exams, time slots, datesheets, and several filtered fetch methods, but those endpoints are not currently mounted in the backend app.

## Data Dependency Order

To test relational resources correctly, create records in this order:

1. Department
2. Degree
3. Branch
4. Year
5. Semester
6. Subject

This order matters because the intended schema relationships are:

- Degree belongs to Department
- Branch belongs to Degree
- Semester belongs to Year
- Subject belongs to Branch and Semester

## Priority Code Improvements

### 1. Fix relational create and update handlers

Several controllers currently ignore required foreign key fields from the request body.

Current gaps:

- `degree.controller.js` does not pass `department_id` into `Degree.create()` or `Degree.update()`
- `branch.controller.js` does not pass `degree_id` into `Branch.create()` or `Branch.update()`
- `semester.controller.js` does not pass `year_id` into `Semester.create()` or `Semester.update()`
- `subject.controller.js` does not pass `branch_id` or `semester_id` into `Subject.create()` or `Subject.update()`
- `subject.controller.js` updates only `subject_name`, not the full subject payload
- `semester.controller.js` uses `semester_name` in update even though the model field is `semester_number`

Recommended rule:

- Every controller should read and validate all required columns that exist in the model.
- Create handlers should pass every required field into `Model.create({...})`.
- Update handlers should update only valid fields for that model.

### 2. Define foreign keys explicitly in Sequelize models

Associations alone are not enough for clear validation behavior.

Recommended model changes:

- Add `department_id` to `Degree`
- Add `degree_id` to `Branch`
- Add `year_id` to `Semester`
- Add `branch_id` and `semester_id` to `Subject`

Each foreign key field should have:

- the correct numeric type
- `allowNull: false` when required
- `references` configured to the parent table key

### 3. Remove duplicated association declarations

Associations are currently defined both:

- inside individual model files
- again in `server/src/models/index.js`

Keep associations in one place only. The cleanest option is usually:

- define model fields inside each model file
- define inter-model associations once in `server/src/models/index.js`

### 4. Standardize environment loading

The backend server loads environment variables successfully, but standalone scripts like `sync.js` can fail depending on working directory and dotenv loading order.

Recommended improvements:

- decide one `.env` location and document it clearly
- load dotenv before importing modules that read `process.env`
- avoid depending on implicit working directory behavior
- if needed, load dotenv with an explicit path

Example direction:

```js
import dotenv from "dotenv";
dotenv.config({ path: new URL("../../.env", import.meta.url).pathname });
```

Use the correct relative path for your actual `.env` location.

### 5. Add centralized validation and error handling

Right now validation logic is repeated and inconsistent.

Recommended improvements:

- add one global error-handling middleware
- return consistent error shapes
- use request validation for body and params
- validate numeric IDs before database calls

Recommended tools:

- `zod`
- `joi`
- `express-validator`

### 6. Align backend, frontend, and docs

Current mismatch:

- frontend docs describe endpoints that do not exist yet
- backend controllers support fewer fields than frontend payloads already send
- README still describes a broader system than the implemented Node backend currently exposes

Recommended action:

- update docs only after verifying routes from `server/src/app.js`
- keep one source of truth for API behavior
- add examples for both success and failure cases

### 7. Add automated API tests

There are no backend endpoint tests in the current repository.

Recommended stack:

- test runner: `vitest` or `jest`
- HTTP testing: `supertest`
- test database: separate PostgreSQL database or Dockerized database

Minimum automated coverage:

- create, list, update, delete for each mounted resource
- validation failures for missing required fields
- not-found behavior for invalid IDs
- foreign key violations for relational resources

### 8. Add health and readiness endpoints

Recommended endpoints:

- `GET /health`
- `GET /ready`

These make deployment and local verification easier.

### 9. Clean up small quality issues

Recommended cleanup items:

- rename `deprtmentRoutes` to `departmentRoutes`
- remove debug `console.log()` calls from `app.js` and `db.js`
- keep CORS strict in production instead of always using `origin: true`
- make response messages consistent across controllers
- return created and updated entities where helpful instead of only messages

## Local Setup Before Testing

## 1. Install dependencies

From the repository root:

```bash
cd client
npm install

cd ../server
npm install
```

## 2. Configure backend environment

Create a `.env` file for the server and define at least:

```env
PORT=8000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
CORS_ORIGIN=http://localhost:5173
```

## 3. Start the backend

```bash
cd server
npm run dev
```

## 4. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

## 5. Optional: sync database tables

Only do this if the database is empty and the models are ready.

```bash
node src/db/sync.js
```

Important:

- do not use destructive sync options against real data
- do not rely on sync as a replacement for proper migrations later

## Manual Endpoint Testing Strategy

Use one tool consistently:

- Postman
- Bruno
- VS Code REST client
- `curl`

Use `http://localhost:8000` as the base URL unless your `.env` uses a different port.

## Endpoint Test Matrix

### 1. Departments

#### Create department

`POST /api/departments`

```json
{
  "department_name": "Computer Science"
}
```

Expected:

- status `201`
- response contains `department_id` and `department_name`

#### Get all departments

`GET /api/departments`

Expected:

- status `200`
- array response

#### Update department

`PUT /api/departments/:id`

```json
{
  "department_name": "CSE"
}
```

Expected:

- status `200` for valid ID
- status `404` for missing ID

#### Delete department

`DELETE /api/departments/:id`

Expected:

- status `200` for valid ID
- status `404` for missing ID

### 2. Degrees

#### Intended create payload

`POST /api/degrees`

```json
{
  "degree_name": "B.Tech",
  "department_id": 1
}
```

Current risk:

- the controller currently ignores `department_id`
- this should be treated as a known defect until fixed

Test cases:

- valid parent `department_id`
- missing `degree_name`
- invalid `department_id`

### 3. Branches

#### Intended create payload

`POST /api/branches`

```json
{
  "branch_name": "Computer Science and Engineering",
  "degree_id": 1
}
```

Current risk:

- the controller currently ignores `degree_id`

Test cases:

- valid parent `degree_id`
- missing `branch_name`
- invalid `degree_id`

### 4. Years

#### Create year

`POST /api/years`

```json
{
  "year_name": "First Year"
}
```

Expected:

- status `201`
- unique year validation should be checked if already present

### 5. Semesters

#### Intended create payload

`POST /api/semesters`

```json
{
  "semester_number": 1,
  "year_id": 1
}
```

Current risks:

- the controller currently ignores `year_id`
- update uses `semester_name` instead of `semester_number`
- error text still mentions `Semester name`

Test cases:

- valid `semester_number` and `year_id`
- missing `semester_number`
- invalid `year_id`
- update `semester_number`

### 6. Subjects

#### Intended create payload

`POST /api/subjects`

```json
{
  "subject_code": "CS101",
  "subject_name": "Programming Fundamentals",
  "branch_id": 1,
  "semester_id": 1
}
```

Current risks:

- the controller currently ignores `branch_id`
- the controller currently ignores `semester_id`
- update only changes `subject_name`

Test cases:

- valid full payload
- missing `subject_name`
- missing `subject_code`
- invalid `branch_id`
- invalid `semester_id`
- duplicate `subject_code`

## Recommended Manual Test Flow

Run the following sequence and record both request and response.

### Phase 1: Happy path

1. Create one department
2. Create one degree linked to that department
3. Create one branch linked to that degree
4. Create one year
5. Create one semester linked to that year
6. Create one subject linked to branch and semester
7. Fetch all six resource lists
8. Update one record from each resource
9. Delete the subject, semester, branch, degree, year, and department in reverse dependency order

### Phase 2: Validation path

For every resource:

- send an empty body
- send wrong field names
- send string IDs where numbers are expected
- send missing foreign keys for relational resources
- send non-existent IDs in update and delete calls

### Phase 3: Cross-origin path

Verify requests from the frontend app loaded at `http://localhost:5173` and confirm:

- browser requests succeed
- preflight requests do not fail
- cookies work only if actually needed

## Example curl Commands

### Create department

```bash
curl -X POST http://localhost:8000/api/departments \
  -H "Content-Type: application/json" \
  -d '{"department_name":"Computer Science"}'
```

### Create degree

```bash
curl -X POST http://localhost:8000/api/degrees \
  -H "Content-Type: application/json" \
  -d '{"degree_name":"B.Tech","department_id":1}'
```

### Create branch

```bash
curl -X POST http://localhost:8000/api/branches \
  -H "Content-Type: application/json" \
  -d '{"branch_name":"CSE","degree_id":1}'
```

### Create year

```bash
curl -X POST http://localhost:8000/api/years \
  -H "Content-Type: application/json" \
  -d '{"year_name":"First Year"}'
```

### Create semester

```bash
curl -X POST http://localhost:8000/api/semesters \
  -H "Content-Type: application/json" \
  -d '{"semester_number":1,"year_id":1}'
```

### Create subject

```bash
curl -X POST http://localhost:8000/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"subject_code":"CS101","subject_name":"Programming Fundamentals","branch_id":1,"semester_id":1}'
```

## Definition Of Done For The Next Backend Cleanup Pass

Consider the backend cleanup successful when all of the following are true:

- all relational create and update handlers accept and persist foreign keys correctly
- model definitions explicitly contain required foreign key fields
- endpoint behavior matches frontend payload expectations
- README and API docs reflect only implemented features
- every mounted route has at least one automated success test and one failure test
- `sync.js` and the server both load environment variables consistently
- CORS works from the actual frontend origin without using overly broad production settings

## Suggested Implementation Order

1. Fix model field definitions for foreign keys
2. Fix create and update controllers for degree, branch, semester, and subject
3. Add request validation and consistent error handling
4. Add automated API tests with Supertest
5. Update frontend API docs and root README
6. Add missing backend routes only after tests for current routes are stable
