import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  branchApi,
  departmentApi,
  degreeApi,
  semesterApi,
  subjectApi,
  yearApi,
  type Branch,
  type Department,
  type Degree,
  type Semester,
  type Subject,
  type Year,
} from "../../api";

type TabName =
  | "Departments"
  | "Degrees"
  | "Branches"
  | "Years"
  | "Semesters"
  | "Subjects";

type RowItem = { id: number; name: string };

function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
    if (typeof err.message === "string" && err.message.trim())
      return err.message;
  }

  if (err instanceof Error && err.message.trim()) return err.message;
  return fallback;
}

type CrudSectionProps<TItem, TCreate extends object, TUpdate extends object> = {
  title: TabName;
  placeholder?: string;
  api: {
    getAll: () => Promise<TItem[]>;
    create: (payload: TCreate) => Promise<unknown>;
    update: (id: number, payload: TUpdate) => Promise<unknown>;
    delete: (id: number) => Promise<unknown>;
  };
  toRow: (item: TItem) => RowItem;
  buildCreatePayload: (input: string) => TCreate;
  buildUpdatePayload: (newValue: string, currentItem?: TItem) => TUpdate;
};

export default function AcademicSetup() {
  const tabs: TabName[] = useMemo(
    () => [
      "Departments",
      "Degrees",
      "Branches",
      "Years",
      "Semesters",
      "Subjects",
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<TabName>("Departments");

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Academic Setup
        </h1>

        <div className="flex gap-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "Departments" && <DepartmentsSection />}
          {activeTab === "Degrees" && <DegreesSection />}
          {activeTab === "Branches" && <BranchesSection />}
          {activeTab === "Years" && <YearsSection />}
          {activeTab === "Semesters" && <SemestersSection />}
          {activeTab === "Subjects" && <SubjectsSection />}
        </div>
      </div>
    </AdminLayout>
  );
}

function CrudSection<TItem, TCreate extends object, TUpdate extends object>({
  title,
  placeholder,
  api,
  toRow,
  buildCreatePayload,
  buildUpdatePayload,
}: CrudSectionProps<TItem, TCreate, TUpdate>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [input, setInput] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const rows = useMemo(() => items.map(toRow), [items, toRow]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getAll();
      setItems(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to load ${title.toLowerCase()}`));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    const value = input.trim();
    if (!value) return;

    try {
      setLoading(true);
      setError("");
      await api.create(buildCreatePayload(value));
      setInput("");
      await loadItems();
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to add ${title.slice(0, -1)}`));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: number) => {
    const value = editValue.trim();
    if (!value) return;

    const currentItem = items.find((it) => toRow(it).id === id);

    try {
      setLoading(true);
      setError("");
      await api.update(id, buildUpdatePayload(value, currentItem));
      setEditingId(null);
      setEditValue("");
      await loadItems();
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to update ${title.slice(0, -1)}`));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${title.slice(0, -1).toLowerCase()}?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.delete(id);
      await loadItems();
    } catch (err: unknown) {
      setError(getErrorMessage(err, `Failed to delete ${title.slice(0, -1)}`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityTable
      title={title}
      rows={rows}
      input={input}
      setInput={setInput}
      onAdd={handleAdd}
      loading={loading}
      error={error}
      placeholder={placeholder}
      editingId={editingId}
      editValue={editValue}
      setEditValue={setEditValue}
      onStartEdit={(id, currentName) => {
        setEditingId(id);
        setEditValue(currentName);
      }}
      onCancelEdit={() => {
        setEditingId(null);
        setEditValue("");
      }}
      onSaveEdit={handleSave}
      onDelete={handleDelete}
    />
  );
}

function DepartmentsSection() {
  return (
    <CrudSection<Department, Department, Department>
      title="Departments"
      api={departmentApi}
      toRow={(d) => ({ id: d.department_id ?? 0, name: d.department_name })}
      buildCreatePayload={(name) => ({ department_name: name })}
      buildUpdatePayload={(name) => ({ department_name: name })}
    />
  );
}

function DegreesSection() {
  return (
    <CrudSection<Degree, Degree, Degree>
      title="Degrees"
      api={degreeApi}
      toRow={(d) => ({ id: d.degree_id ?? 0, name: d.degree_name })}
      buildCreatePayload={(name) => ({ degree_name: name, department_id: 1 })}
      buildUpdatePayload={(name, current) => ({
        degree_name: name,
        department_id: current?.department_id ?? 1,
      })}
    />
  );
}

function BranchesSection() {
  return (
    <CrudSection<Branch, Branch, Branch>
      title="Branches"
      api={branchApi}
      toRow={(b) => ({ id: b.branch_id ?? 0, name: b.branch_name })}
      buildCreatePayload={(name) => ({ branch_name: name, degree_id: 1 })}
      buildUpdatePayload={(name, current) => ({
        branch_name: name,
        degree_id: current?.degree_id ?? 1,
      })}
    />
  );
}

function YearsSection() {
  return (
    <CrudSection<Year, Year, Year>
      title="Years"
      api={yearApi}
      toRow={(y) => ({ id: y.year_id ?? 0, name: y.year_name })}
      buildCreatePayload={(name) => ({ year_name: name })}
      buildUpdatePayload={(name) => ({ year_name: name })}
    />
  );
}

function SemestersSection() {
  return (
    <CrudSection<Semester, Semester, Semester>
      title="Semesters"
      placeholder="Semester Number"
      api={semesterApi}
      toRow={(s) => ({
        id: s.semester_id ?? 0,
        name: String(s.semester_number),
      })}
      buildCreatePayload={(value) => ({
        semester_number: Number(value),
        year_id: 1,
      })}
      buildUpdatePayload={(value, current) => ({
        semester_number: Number(value),
        year_id: current?.year_id ?? 1,
      })}
    />
  );
}

function SubjectsSection() {
  return (
    <CrudSection<Subject, Subject, Subject>
      title="Subjects"
      api={subjectApi}
      toRow={(s) => ({ id: s.subject_id ?? 0, name: s.subject_name })}
      buildCreatePayload={(name) => ({
        subject_code: `SUB${Date.now()}`,
        subject_name: name,
        branch_id: 1,
        semester_id: 1,
      })}
      buildUpdatePayload={(name, current) => ({
        subject_code: current?.subject_code ?? `SUB${Date.now()}`,
        subject_name: name,
        branch_id: current?.branch_id ?? 1,
        semester_id: current?.semester_id ?? 1,
      })}
    />
  );
}

type EntityTableProps = {
  title: TabName;
  rows: RowItem[];
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  loading: boolean;
  error: string;
  placeholder?: string;

  editingId: number | null;
  editValue: string;
  setEditValue: (v: string) => void;
  onStartEdit: (id: number, currentName: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

function EntityTable({
  title,
  rows,
  input,
  setInput,
  onAdd,
  loading,
  error,
  placeholder,
  editingId,
  editValue,
  setEditValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: EntityTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Add {title.slice(0, -1)}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          type="text"
          placeholder={placeholder ?? `${title.slice(0, -1)} Name`}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : `Add ${title.slice(0, -1)}`}
        </button>
      </div>

      <h3 className="text-md font-medium text-gray-700 mb-3">{title} List</h3>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">
              {title.slice(0, -1)} Name
            </th>
            <th className="border px-4 py-2 text-center">Edit</th>
            <th className="border px-4 py-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {loading && rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border px-4 py-4 text-center text-gray-500"
              >
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border px-4 py-4 text-center text-gray-500"
              >
                No {title.toLowerCase()} added yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="border px-4 py-2">{row.id}</td>
                <td className="border px-4 py-2">
                  {editingId === row.id ? (
                    <InlineEdit
                      value={editValue}
                      onChange={setEditValue}
                      onSave={() => onSaveEdit(row.id)}
                      onCancel={onCancelEdit}
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td
                  onClick={() =>
                    editingId === row.id
                      ? onCancelEdit()
                      : onStartEdit(row.id, row.name)
                  }
                  className="border px-4 py-2 text-center text-blue-600 cursor-pointer hover:bg-blue-50 transition"
                >
                  {editingId === row.id ? "Cancel" : "Edit"}
                </td>
                <td
                  onClick={() => onDelete(row.id)}
                  className="border px-4 py-2 text-center text-red-600 cursor-pointer hover:bg-red-50 transition"
                >
                  Delete
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function InlineEdit({
  value,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <input
        className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
      />
      <button
        onClick={onSave}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Save
      </button>
    </div>
  );
}
