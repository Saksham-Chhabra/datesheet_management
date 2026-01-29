import AdminLayout from "../../layouts/AdminLayout";

export default function GenerateDatesheet() {
  return (
    <AdminLayout>
      <div className="max-w-6xl">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Generate Datesheet
        </h1>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Degree */}
            <select className="border px-4 py-2 rounded-md">
              <option>Select Degree</option>
              <option>B.Tech</option>
              <option>M.Tech</option>
            </select>

            {/* Branch */}
            <select className="border px-4 py-2 rounded-md">
              <option>Select Branch</option>
              <option>CSE</option>
              <option>ECE</option>
            </select>

            {/* Semester */}
            <select className="border px-4 py-2 rounded-md">
              <option>Select Semester</option>
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Exam Type */}
            <select className="border px-4 py-2 rounded-md">
              <option>Exam Type</option>
              <option>Midterm</option>
              <option>Final</option>
            </select>

            {/* Start Date */}
            <input type="date" className="border px-4 py-2 rounded-md" />

            {/* End Date */}
            <input type="date" className="border px-4 py-2 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Time Slot */}
            <select className="border px-4 py-2 rounded-md">
              <option>Time Slots</option>
              <option>9:00 AM - 12:00 PM</option>
              <option>2:00 PM - 5:00 PM</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="text-right">
            <button className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition">
              Generate Datesheet
            </button>
          </div>
        </div>

        {/* Generated Datesheet Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Generated Datesheet
          </h2>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Time</th>
                <th className="border px-4 py-2 text-left">Subject</th>
                <th className="border px-4 py-2 text-left">Room</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">15-05-2024</td>
                <td className="border px-4 py-2">9:00 AM</td>
                <td className="border px-4 py-2">Mathematics</td>
                <td className="border px-4 py-2">Room 101</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">16-05-2024</td>
                <td className="border px-4 py-2">11:00 AM</td>
                <td className="border px-4 py-2">Physics</td>
                <td className="border px-4 py-2">Room 202</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">17-05-2024</td>
                <td className="border px-4 py-2">2:00 PM</td>
                <td className="border px-4 py-2">Computer Science</td>
                <td className="border px-4 py-2">Room 303</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
