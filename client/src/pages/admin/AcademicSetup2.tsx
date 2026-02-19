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
      if (typeof message === "string") return message;
    }
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

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

        {activeTab === "Departments" && (
          <BasicCrud
            title="Department"
            api={departmentApi}
            idKey="department_id"
            nameKey="department_name"
          />
        )}

        {activeTab === "Years" && (
          <BasicCrud
            title="Year"
            api={yearApi}
            idKey="year_id"
            nameKey="year_name"
          />
        )}

        {activeTab === "Degrees" && <DegreesSection />}
        {activeTab === "Branches" && <BranchesSection />}
        {activeTab === "Semesters" && <SemestersSection />}
        {activeTab === "Subjects" && <SubjectsSection />}
      </div>
    </AdminLayout>
  );
}

/* ================= BASIC CRUD ================= */

function BasicCrud({
  title,
  api,
  idKey,
  nameKey,
}: {
  title: string;
  api: any;
  idKey: string;
  nameKey: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await api.getAll();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err, "Load failed"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!input.trim()) return;
    await api.create({ [nameKey]: input });
    setInput("");
    load();
  };

  const update = async (id: number) => {
    await api.update(id, { [nameKey]: editValue });
    setEditingId(null);
    load();
  };

  const remove = async (id: number) => {
    await api.delete(id);
    load();
  };

  return (
    <CrudTable
      title={title}
      items={items}
      idKey={idKey}
      nameKey={nameKey}
      input={input}
      setInput={setInput}
      editingId={editingId}
      setEditingId={setEditingId}
      editValue={editValue}
      setEditValue={setEditValue}
      onAdd={add}
      onUpdate={update}
      onDelete={remove}
    />
  );
}

/* ================= DEGREES ================= */

function DegreesSection() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState<number | null>(null);

  useEffect(() => {
    departmentApi.getAll().then((d) => {
      setDepartments(d);
      if (d.length) setDepartmentId(d[0].department_id);
    });
  }, []);

  return (
    <AdvancedCrud
      title="Degree"
      api={degreeApi}
      idKey="degree_id"
      nameKey="degree_name"
      extraFields={{ department_id: departmentId }}
      dropdown={
        <select
          value={departmentId ?? ""}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>
      }
    />
  );
}

/* ================= BRANCHES ================= */

function BranchesSection() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [degreeId, setDegreeId] = useState<number | null>(null);

  useEffect(() => {
    degreeApi.getAll().then((d) => {
      setDegrees(d);
      if (d.length) setDegreeId(d[0].degree_id);
    });
  }, []);

  return (
    <AdvancedCrud
      title="Branch"
      api={branchApi}
      idKey="branch_id"
      nameKey="branch_name"
      extraFields={{ degree_id: degreeId }}
      dropdown={
        <select
          value={degreeId ?? ""}
          onChange={(e) => setDegreeId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {degrees.map((d) => (
            <option key={d.degree_id} value={d.degree_id}>
              {d.degree_name}
            </option>
          ))}
        </select>
      }
    />
  );
}

/* ================= SEMESTERS ================= */

function SemestersSection() {
  const [years, setYears] = useState<Year[]>([]);
  const [yearId, setYearId] = useState<number | null>(null);

  useEffect(() => {
    yearApi.getAll().then((y) => {
      setYears(y);
      if (y.length) setYearId(y[0].year_id);
    });
  }, []);

  return (
    <AdvancedCrud
      title="Semester"
      api={semesterApi}
      idKey="semester_id"
      nameKey="semester_number"
      extraFields={{ year_id: yearId }}
      dropdown={
        <select
          value={yearId ?? ""}
          onChange={(e) => setYearId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {years.map((y) => (
            <option key={y.year_id} value={y.year_id}>
              {y.year_name}
            </option>
          ))}
        </select>
      }
      isNumber
    />
  );
}

/* ================= SUBJECTS ================= */

function SubjectsSection() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [semesterId, setSemesterId] = useState<number | null>(null);

  useEffect(() => {
    branchApi.getAll().then((b) => {
      setBranches(b);
      if (b.length) setBranchId(b[0].branch_id);
    });

    semesterApi.getAll().then((s) => {
      setSemesters(s);
      if (s.length) setSemesterId(s[0].semester_id);
    });
  }, []);

  return (
    <AdvancedCrud
      title="Subject"
      api={subjectApi}
      idKey="subject_id"
      nameKey="subject_name"
      extraFields={{
        branch_id: branchId,
        semester_id: semesterId,
        subject_code: `SUB${Date.now()}`,
      }}
      dropdown={
        <div className="flex gap-3">
          <select
            value={branchId ?? ""}
            onChange={(e) => setBranchId(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {branches.map((b) => (
              <option key={b.branch_id} value={b.branch_id}>
                {b.branch_name}
              </option>
            ))}
          </select>

          <select
            value={semesterId ?? ""}
            onChange={(e) => setSemesterId(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {semesters.map((s) => (
              <option key={s.semester_id} value={s.semester_id}>
                Semester {s.semester_number}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
}

/* ================= SHARED TABLE ================= */

function AdvancedCrud({
  title,
  api,
  idKey,
  nameKey,
  extraFields,
  dropdown,
  isNumber = false,
}: any) {
  const [items, setItems] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const load = async () => {
    const data = await api.getAll();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!input.trim()) return;

    await api.create({
      [nameKey]: isNumber ? Number(input) : input,
      ...extraFields,
    });

    setInput("");
    load();
  };

  const update = async (id: number) => {
    await api.update(id, {
      [nameKey]: isNumber ? Number(editValue) : editValue,
      ...extraFields,
    });
    setEditingId(null);
    load();
  };

  const remove = async (id: number) => {
    await api.delete(id);
    load();
  };

  return (
    <CrudTable
      title={title}
      items={items}
      idKey={idKey}
      nameKey={nameKey}
      input={input}
      setInput={setInput}
      editingId={editingId}
      setEditingId={setEditingId}
      editValue={editValue}
      setEditValue={setEditValue}
      onAdd={add}
      onUpdate={update}
      onDelete={remove}
      dropdown={dropdown}
    />
  );
}

/* ================= TABLE UI ================= */

function CrudTable({
  title,
  items,
  idKey,
  nameKey,
  input,
  setInput,
  editingId,
  setEditingId,
  editValue,
  setEditValue,
  onAdd,
  onUpdate,
  onDelete,
  dropdown,
}: any) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex gap-3 mb-4 items-center">
        {dropdown}
        <input
          className="border px-3 py-2 rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${title} Name`}
        />
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Edit</th>
            <th className="border px-2 py-1">Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any) => (
            <tr key={item[idKey]}>
              <td className="border px-2 py-1">{item[idKey]}</td>
              <td className="border px-2 py-1">
                {editingId === item[idKey] ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  item[nameKey]
                )}
              </td>
              <td
                className="border px-2 py-1 text-blue-600 cursor-pointer"
                onClick={() => {
                  if (editingId === item[idKey]) {
                    onUpdate(item[idKey]);
                  } else {
                    setEditingId(item[idKey]);
                    setEditValue(item[nameKey]);
                  }
                }}
              >
                {editingId === item[idKey] ? "Save" : "Edit"}
              </td>
              <td
                className="border px-2 py-1 text-red-600 cursor-pointer"
                onClick={() => onDelete(item[idKey])}
              >
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
