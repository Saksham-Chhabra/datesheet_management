// Example: How to use the API services in your components

import { useState, useEffect } from "react";
import { departmentApi, Department, degreeApi, subjectApi } from "../api";
import { useApi, useFetch } from "../hooks/useApi";

// ============================================
// EXAMPLE 1: Using useFetch hook (for getting data on mount)
// ============================================
function DepartmentsList() {
  const {
    data: departments,
    loading,
    error,
    refetch,
  } = useFetch(() => departmentApi.getAll());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {departments?.map((dept) => (
        <div key={dept.department_id}>{dept.department_name}</div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 2: Using useApi hook (for CRUD operations)
// ============================================
function AddDepartment() {
  const [name, setName] = useState("");
  const { loading, error, execute } = useApi<Department>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await execute(() => departmentApi.create({ department_name: name }), {
        onSuccess: (data) => {
          alert("Department created successfully!");
          setName("");
        },
        onError: (error) => {
          alert("Failed to create department: " + error);
        },
      });
    } catch (err) {
      // Error already handled in hook
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
        {loading ? "Adding..." : "Add Department"}
      </button>
      {error && <div>{error.message}</div>}
    </form>
  );
}

// ============================================
// EXAMPLE 3: Complete CRUD in one component
// ============================================
function DepartmentsManager() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const { loading, error, execute } = useApi();

  // Load departments on mount
  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await departmentApi.getAll();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  // CREATE
  const handleAdd = async () => {
    if (!newName.trim()) return;

    try {
      await execute(() => departmentApi.create({ department_name: newName }), {
        onSuccess: () => {
          setNewName("");
          loadDepartments(); // Refresh list
        },
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;

    try {
      await execute(
        () => departmentApi.update(id, { department_name: editName }),
        {
          onSuccess: () => {
            setEditingId(null);
            setEditName("");
            loadDepartments();
          },
        },
      );
    } catch (err) {
      // Error handled by hook
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      await execute(() => departmentApi.delete(id), {
        onSuccess: () => {
          loadDepartments();
        },
      });
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div>
      <h2>Departments</h2>

      {/* Add new department */}
      <div>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Department"
        />
        <button onClick={handleAdd} disabled={loading}>
          Add
        </button>
      </div>

      {/* List departments */}
      <ul>
        {departments.map((dept) => (
          <li key={dept.department_id}>
            {editingId === dept.department_id ? (
              // Edit mode
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => handleUpdate(dept.department_id!)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              // View mode
              <>
                {dept.department_name}
                <button
                  onClick={() => {
                    setEditingId(dept.department_id!);
                    setEditName(dept.department_name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(dept.department_id!)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </div>
  );
}

// ============================================
// EXAMPLE 4: Using direct API calls (without hooks)
// ============================================
function DirectApiExample() {
  const handleCreateDepartment = async () => {
    try {
      const newDept = await departmentApi.create({
        department_name: "Computer Science",
      });
      console.log("Created:", newDept);
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleGetDepartments = async () => {
    try {
      const departments = await departmentApi.getAll();
      console.log("Departments:", departments);
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleUpdateDepartment = async (id: number) => {
    try {
      const updated = await departmentApi.update(id, {
        department_name: "Updated Name",
      });
      console.log("Updated:", updated);
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await departmentApi.delete(id);
      console.log("Deleted successfully");
    } catch (error: any) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <button onClick={handleCreateDepartment}>Create Department</button>
      <button onClick={handleGetDepartments}>Get All Departments</button>
      <button onClick={() => handleUpdateDepartment(1)}>
        Update Department 1
      </button>
      <button onClick={() => handleDeleteDepartment(1)}>
        Delete Department 1
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Working with related data (Degrees and Departments)
// ============================================
function DegreesWithDepartments() {
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const { data: departments } = useFetch(() => departmentApi.getAll());
  const { data: degrees, refetch } = useFetch(
    () =>
      selectedDeptId
        ? degreeApi.getByDepartment(selectedDeptId)
        : Promise.resolve([]),
    [selectedDeptId],
  );

  const handleAddDegree = async (degreeName: string) => {
    if (!selectedDeptId) return;

    try {
      await degreeApi.create({
        degree_name: degreeName,
        department_id: selectedDeptId,
      });
      refetch(); // Refresh degrees list
    } catch (error) {
      console.error("Failed to add degree:", error);
    }
  };

  return (
    <div>
      <select onChange={(e) => setSelectedDeptId(Number(e.target.value))}>
        <option>Select Department</option>
        {departments?.map((dept) => (
          <option key={dept.department_id} value={dept.department_id}>
            {dept.department_name}
          </option>
        ))}
      </select>

      {degrees && (
        <ul>
          {degrees.map((degree) => (
            <li key={degree.degree_id}>{degree.degree_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 6: All available API methods
// ============================================

// Department API
async function departmentExamples() {
  // Get all
  const all = await departmentApi.getAll();

  // Get by ID
  const single = await departmentApi.getById(1);

  // Create
  const created = await departmentApi.create({ department_name: "CS" });

  // Update
  const updated = await departmentApi.update(1, {
    department_name: "Computer Science",
  });

  // Delete
  await departmentApi.delete(1);
}

// Degree API
async function degreeExamples() {
  await degreeApi.getAll();
  await degreeApi.getById(1);
  await degreeApi.getByDepartment(1);
  await degreeApi.create({ degree_name: "B.Tech", department_id: 1 });
  await degreeApi.update(1, {
    degree_name: "Bachelor of Technology",
    department_id: 1,
  });
  await degreeApi.delete(1);
}

// Subject API
async function subjectExamples() {
  await subjectApi.getAll();
  await subjectApi.getById(1);
  await subjectApi.getByBranch(1);
  await subjectApi.getBySemester(1);
  await subjectApi.getByBranchAndSemester(1, 1);
  await subjectApi.create({
    subject_code: "CS101",
    subject_name: "Introduction to CS",
    branch_id: 1,
    semester_id: 1,
  });
  await subjectApi.update(1, {
    subject_code: "CS101",
    subject_name: "Intro to Computer Science",
    branch_id: 1,
    semester_id: 1,
  });
  await subjectApi.delete(1);
}

export {
  DepartmentsList,
  AddDepartment,
  DepartmentsManager,
  DirectApiExample,
  DegreesWithDepartments,
};
