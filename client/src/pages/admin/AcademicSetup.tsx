import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

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
        {activeTab === "Departments" && <DepartmentsSection />}
        {activeTab !== "Departments" && (
          <div className="text-gray-500 text-sm">
            UI for <b>{activeTab}</b> will follow the same structure.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function DepartmentsSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      
      {/* Add Department */}
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Add Department
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Department Name"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Add Department
        </button>
      </div>

      {/* Departments List */}
      <h3 className="text-md font-medium text-gray-700 mb-3">
        Departments List
      </h3>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Department Name</th>
            <th className="border px-4 py-2 text-center">Edit</th>
            <th className="border px-4 py-2 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">1</td>
            <td className="border px-4 py-2">Computer Science</td>
            <td className="border px-4 py-2 text-center text-blue-600 cursor-pointer">
              Edit
            </td>
            <td className="border px-4 py-2 text-center text-red-600 cursor-pointer">
              Delete
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-2">2</td>
            <td className="border px-4 py-2">Electrical Engineering</td>
            <td className="border px-4 py-2 text-center text-blue-600 cursor-pointer">
              Edit
            </td>
            <td className="border px-4 py-2 text-center text-red-600 cursor-pointer">
              Delete
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
