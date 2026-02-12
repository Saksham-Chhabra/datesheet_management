# Frontend API Documentation

## 📦 Available API Services

All API services are located in `src/api/` and can be imported from `src/api/index.ts`.

### Available Services:

- `departmentApi` - Department CRUD operations
- `degreeApi` - Degree CRUD operations
- `branchApi` - Branch CRUD operations
- `yearApi` - Year CRUD operations
- `semesterApi` - Semester CRUD operations
- `subjectApi` - Subject CRUD operations
- `examApi` - Exam CRUD operations
- `timeSlotApi` - Time Slot CRUD operations
- `datesheetApi` - Datesheet CRUD and generation operations

---

## 🚀 Quick Start

### 1. Configure Environment

Create a `.env` file in the client root directory:

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Import API Services

```typescript
import { departmentApi, degreeApi, subjectApi } from "../api";
```

### 3. Use in Components

```typescript
// Get all departments
const departments = await departmentApi.getAll();

// Create a new department
await departmentApi.create({ department_name: "Computer Science" });

// Update a department
await departmentApi.update(1, { department_name: "CS" });

// Delete a department
await departmentApi.delete(1);
```

---

## 📚 API Methods

### Department API

```typescript
import { departmentApi, Department } from "../api";

// GET /api/departments
const departments = await departmentApi.getAll();

// GET /api/departments/:id
const department = await departmentApi.getById(1);

// POST /api/departments
const created = await departmentApi.create({
  department_name: "Computer Science",
});

// PUT /api/departments/:id
const updated = await departmentApi.update(1, {
  department_name: "CS Department",
});

// DELETE /api/departments/:id
await departmentApi.delete(1);
```

### Degree API

```typescript
import { degreeApi, Degree } from "../api";

// All CRUD operations
await degreeApi.getAll();
await degreeApi.getById(1);
await degreeApi.getByDepartment(departmentId);
await degreeApi.create({ degree_name: "B.Tech", department_id: 1 });
await degreeApi.update(1, { degree_name: "Bachelor", department_id: 1 });
await degreeApi.delete(1);
```

### Branch API

```typescript
import { branchApi, Branch } from "../api";

await branchApi.getAll();
await branchApi.getById(1);
await branchApi.getByDegree(degreeId);
await branchApi.create({ branch_name: "Software", degree_id: 1 });
await branchApi.update(1, {
  branch_name: "Software Engineering",
  degree_id: 1,
});
await branchApi.delete(1);
```

### Subject API

```typescript
import { subjectApi, Subject } from "../api";

await subjectApi.getAll();
await subjectApi.getById(1);
await subjectApi.getByBranch(branchId);
await subjectApi.getBySemester(semesterId);
await subjectApi.getByBranchAndSemester(branchId, semesterId);
await subjectApi.create({
  subject_code: "CS101",
  subject_name: "Data Structures",
  branch_id: 1,
  semester_id: 1,
});
await subjectApi.update(1, {
  /* ... */
});
await subjectApi.delete(1);
```

### Datesheet API

```typescript
import { datesheetApi, DateSheet } from "../api";

await datesheetApi.getAll();
await datesheetApi.getById(1);
await datesheetApi.getByExam(examId);
await datesheetApi.getBySubject(subjectId);
await datesheetApi.create({
  exam_date: "2026-03-15",
  subject_id: 1,
  exam_id: 1,
  slot_id: 1,
});
await datesheetApi.update(1, {
  /* ... */
});
await datesheetApi.delete(1);

// Special: Generate datesheet
await datesheetApi.generate(examId, {
  /* options */
});
```

---

## 🪝 Using React Hooks

### useFetch Hook (Auto-load on mount)

```typescript
import { useFetch } from '../hooks/useApi';
import { departmentApi } from '../api';

function MyComponent() {
  const { data, loading, error, refetch } = useFetch(
    () => departmentApi.getAll()
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {data?.map(dept => (
        <div key={dept.department_id}>{dept.department_name}</div>
      ))}
    </div>
  );
}
```

### useApi Hook (Manual operations)

```typescript
import { useApi } from '../hooks/useApi';
import { departmentApi } from '../api';

function AddDepartmentForm() {
  const [name, setName] = useState('');
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await execute(
        () => departmentApi.create({ department_name: name }),
        {
          onSuccess: (data) => {
            alert('Created successfully!');
            setName('');
          },
          onError: (error) => {
            alert('Failed: ' + error);
          }
        }
      );
    } catch (err) {
      // Error already handled
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

---

## 🎯 Complete CRUD Example

```typescript
import { useState, useEffect } from 'react';
import { departmentApi, Department } from '../api';
import { useApi } from '../hooks/useApi';

function DepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await departmentApi.getAll();
    setDepartments(data);
  };

  const handleCreate = async () => {
    await execute(
      () => departmentApi.create({ department_name: name }),
      { onSuccess: () => { setName(''); loadDepartments(); } }
    );
  };

  const handleUpdate = async (id: number) => {
    await execute(
      () => departmentApi.update(id, { department_name: editName }),
      { onSuccess: () => { setEditingId(null); loadDepartments(); } }
    );
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete?')) {
      await execute(
        () => departmentApi.delete(id),
        { onSuccess: loadDepartments }
      );
    }
  };

  return (
    <div>
      {/* Add Form */}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleCreate} disabled={loading}>Add</button>

      {/* List */}
      {departments.map(dept => (
        <div key={dept.department_id}>
          {editingId === dept.department_id ? (
            <>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} />
              <button onClick={() => handleUpdate(dept.department_id!)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              {dept.department_name}
              <button onClick={() => {
                setEditingId(dept.department_id!);
                setEditName(dept.department_name);
              }}>Edit</button>
              <button onClick={() => handleDelete(dept.department_id!)}>Delete</button>
            </>
          )}
        </div>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
```

---

## 🌐 API Configuration

The axios instance is pre-configured with:

- Base URL from environment variable `VITE_API_URL`
- Automatic authorization header injection
- Global error handling (401 redirects to login)
- 10-second timeout
- Request/Response interceptors

To modify configuration, edit `src/api/axios.config.ts`

---

## 🔐 Authentication

The axios config automatically:

1. Reads token from `localStorage.getItem('token')`
2. Adds it to request headers as `Authorization: Bearer <token>`
3. Redirects to `/login` on 401 responses

---

## 📝 TypeScript Types

All API responses are fully typed. Import types from API files:

```typescript
import type { Department, Degree, Subject } from "../api";

const dept: Department = {
  department_id: 1,
  department_name: "Computer Science",
};
```

---

## 🚨 Error Handling

```typescript
try {
  const result = await departmentApi.create({ department_name: "CS" });
} catch (error: any) {
  // Access error details
  console.error(error.response?.data?.message);
  console.error(error.response?.status);
  console.error(error.message);
}
```

With hooks:

```typescript
const { error, execute } = useApi();

await execute(
  () => departmentApi.create({ department_name: 'CS' }),
  {
    onError: (error) => {
      // Handle error
      toast.error(error);
    }
  }
);

// Or check error state
if (error) {
  return <div>Error: {error.message}</div>;
}
```

---

## 📖 Full Examples

See `src/api/usage-examples.tsx` for comprehensive examples including:

- Basic CRUD operations
- Using hooks
- Handling related data
- Loading states
- Error handling
- Form integration

---

## 🔗 API Endpoints Reference

All endpoints assume base URL: `http://localhost:8000/api`

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| GET    | /departments             | Get all departments       |
| GET    | /departments/:id         | Get department by ID      |
| POST   | /departments             | Create department         |
| PUT    | /departments/:id         | Update department         |
| DELETE | /departments/:id         | Delete department         |
| GET    | /degrees                 | Get all degrees           |
| GET    | /degrees/department/:id  | Get degrees by department |
| GET    | /branches                | Get all branches          |
| GET    | /branches/degree/:id     | Get branches by degree    |
| GET    | /subjects                | Get all subjects          |
| GET    | /subjects/branch/:id     | Get subjects by branch    |
| GET    | /subjects/semester/:id   | Get subjects by semester  |
| GET    | /datesheets/exam/:id     | Get datesheets by exam    |
| POST   | /datesheets/generate/:id | Generate datesheet        |

_(Similar patterns for all other models)_
