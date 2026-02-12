// ...existing code...
import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

type Item = { id: number; name: string; editing?: boolean };

export default function AcademicSetup() {
  const tabs = ["Departments", "Degrees", "Branches", "Semesters", "Subjects"];
  const [activeTab, setActiveTab] = useState("Departments");

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Academic Setup
        </h1>

        {/* Tabs */}
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

        {/* Content */}
        <div>
          {tabs.map((tab) =>
            activeTab === tab ? (
              <EntitySection key={tab} title={tab} initialItems={getInitialItems(tab)} />
            ) : null
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

/* Generic section used for Departments, Degrees, Branches, Semesters, Subjects */
function EntitySection({ title, initialItems }: { title: string; initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(initialItems.length + 1);

  function addItem() {
    const name = input.trim();
    if (!name) return;
    setItems((s) => [...s, { id: nextId, name }]);
    setNextId((n) => n + 1);
    setInput("");
  }

  function startEdit(id: number) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, editing: true } : it)));
  }

  function saveEdit(id: number, newName: string) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, name: newName, editing: false } : it)));
  }

  function cancelEdit(id: number) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, editing: false } : it)));
  }

  function deleteItem(id: number) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Add {title.slice(0, -1)}</h2>

      <div className="flex gap-4 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          type="text"
          placeholder={`${title.slice(0, -1)} Name`}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addItem}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add {title.slice(0, -1)}
        </button>
      </div>

      <h3 className="text-md font-medium text-gray-700 mb-3">{title} List</h3>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">{title.slice(0, -1)} Name</th>
            <th className="border px-4 py-2 text-center">Edit</th>
            <th className="border px-4 py-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="border px-4 py-4 text-center text-gray-500">
                No {title.toLowerCase()} added yet.
              </td>
            </tr>
          )}
          {items.map((it) => (
            <tr key={it.id}>
              <td className="border px-4 py-2">{it.id}</td>
              <td className="border px-4 py-2">
                {it.editing ? (
                  <InlineEdit
                    initialValue={it.name}
                    onSave={(val) => saveEdit(it.id, val)}
                    onCancel={() => cancelEdit(it.id)}
                  />
                ) : (
                  it.name
                )}
              </td>
              <td
                onClick={() => (it.editing ? cancelEdit(it.id) : startEdit(it.id))}
                className="border px-4 py-2 text-center text-blue-600 cursor-pointer"
              >
                {it.editing ? "Cancel" : "Edit"}
              </td>
              <td
                onClick={() => deleteItem(it.id)}
                className="border px-4 py-2 text-center text-red-600 cursor-pointer"
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

/* small inline edit input used inside table */
function InlineEdit({ initialValue, onSave, onCancel }: { initialValue: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState(initialValue);
  return (
    <div className="flex gap-2 items-center">
      <input
        className="px-2 py-1 border rounded-md"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(val.trim() || initialValue);
          if (e.key === "Escape") onCancel();
        }}
      />
      <button onClick={() => onSave(val.trim() || initialValue)} className="text-sm text-blue-600">Save</button>
    </div>
  );
}

/* helper to provide sample items per tab */
function getInitialItems(tab: string): Item[] {
  switch (tab) {
    case "Departments":
      return [
        { id: 1, name: "Computer Science" },
        { id: 2, name: "Electrical Engineering" },
      ];
    case "Degrees":
      return [
        { id: 1, name: "B-tech" },
        { id: 2, name: "M-tech" },
      ];
    case "Branches":
      return [
        { id: 1, name: "Software" },
        { id: 2, name: "Hardware" },
      ];
    case "Semesters":
      return [
        { id: 1, name: "Semester 1" },
        { id: 2, name: "Semester 2" },
      ];
    case "Subjects":
      return [
        { id: 1, name: "Data Structures" },
        { id: 2, name: "Circuits" },
      ];
    default:
      return [];
  }
}
//