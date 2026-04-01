import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { datesheetApi, type DateSheetRecord } from "../api";

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

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentDashboard() {
  const { email } = useAuth();
  const navigate = useNavigate();
  const [datesheet, setDatesheet] = useState<DateSheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDatesheet() {
      try {
        setLoading(true);
        setError("");
        const data = await datesheetApi.getMy();
        setDatesheet(data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load datesheet"));
      } finally {
        setLoading(false);
      }
    }

    loadDatesheet();
  }, []);

  const upcomingDatesheet = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return datesheet
      .filter((row) => {
        const examDate = new Date(row.exam_date);
        return !Number.isNaN(examDate.getTime()) && examDate >= today;
      })
      .sort((a, b) => a.exam_date.localeCompare(b.exam_date))
      .slice(0, 6);
  }, [datesheet]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, {email}! View your datesheet and schedule here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Datesheet Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              My Datesheet
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              View your exam schedule and important dates
            </p>
            <button
              onClick={() => navigate("/student/datesheet")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Datesheet →
            </button>
          </div>

          {/* Schedule Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              My Schedule
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Check your timetable and class schedule
            </p>
            <button
              onClick={() => navigate("/student/schedule")}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View Schedule →
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              My Profile
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage your account settings and preferences
            </p>
            <button
              onClick={() => navigate("/student/profile")}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Profile →
            </button>
          </div>
        </div>

        {/* Recent Announcements Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Announcements
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-gray-800 font-medium">
                Exam schedule has been published
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm text-gray-500">Yesterday</p>
              <p className="text-gray-800 font-medium">
                New academic guidelines released
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Exams
            </h2>
            <button
              onClick={() => navigate("/student/datesheet")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View full datesheet
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading datesheet...</p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          {!loading && !error && upcomingDatesheet.length === 0 ? (
            <p className="text-sm text-gray-500">
              No datesheet entries available yet.
            </p>
          ) : null}

          {!loading && !error && upcomingDatesheet.length > 0 ? (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Subject</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">Exam</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDatesheet.map((row) => (
                  <tr key={row.datesheet_id}>
                    <td className="border px-4 py-2">
                      {formatDateLabel(row.exam_date)}
                    </td>
                    <td className="border px-4 py-2">
                      {row.Subject?.subject_name ?? "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {row.TimeSlot
                        ? `${row.TimeSlot.start_time} - ${row.TimeSlot.end_time}`
                        : "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {row.Exam?.exam_type ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
}
