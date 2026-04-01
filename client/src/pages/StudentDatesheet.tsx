import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  authApi,
  branchApi,
  datesheetApi,
  semesterApi,
  type Branch,
  type DateSheetRecord,
  type Semester,
} from "../api";

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

export default function StudentDatesheet() {
  const [rows, setRows] = useState<DateSheetRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    null,
  );
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDatesheet() {
      try {
        setLoading(true);
        setError("");

        const me = await authApi.getMe();
        if (me.profile) {
          setSelectedBranchId(Number(me.profile.branch_id));
          setSelectedSemesterId(Number(me.profile.semester_id));
        }

        const [branchData, semesterData] = await Promise.all([
          branchApi.getAll(),
          semesterApi.getAll(),
        ]);
        setBranches(branchData);
        setSemesters(semesterData);

        const data = await datesheetApi.getMy();
        data.sort((a, b) => a.exam_date.localeCompare(b.exam_date));
        setRows(data);
        setNeedsProfileSetup(false);
      } catch (err) {
        const message = getErrorMessage(err, "Failed to load datesheet");
        setError(message);
        if (message.toLowerCase().includes("profile")) {
          setNeedsProfileSetup(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadDatesheet();
  }, []);

  const saveAcademicProfile = async () => {
    if (!selectedBranchId || !selectedSemesterId) {
      setError("Select both branch and semester.");
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      await authApi.updateMyAcademicProfile({
        branch_id: selectedBranchId,
        semester_id: selectedSemesterId,
      });

      const data = await datesheetApi.getMy();
      data.sort((a, b) => a.exam_date.localeCompare(b.exam_date));
      setRows(data);
      setNeedsProfileSetup(false);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save academic profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const groupedByExam = useMemo(() => {
    const grouped = new Map<string, DateSheetRecord[]>();
    rows.forEach((row) => {
      const examKey = row.Exam
        ? `${row.Exam.exam_type} (${row.Exam.academic_year})`
        : "Unassigned Exam";
      if (!grouped.has(examKey)) grouped.set(examKey, []);
      grouped.get(examKey)?.push(row);
    });
    return grouped;
  }, [rows]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Datesheet</h1>
        <p className="text-gray-600 mb-6">
          All generated exam entries are shown below.
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Loading datesheet...</p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {needsProfileSetup ? (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-amber-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Set Your Academic Profile
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose your branch and semester to view only your datesheet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <select
                className="border px-3 py-2 rounded"
                value={selectedBranchId ?? ""}
                onChange={(e) => setSelectedBranchId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>

              <select
                className="border px-3 py-2 rounded"
                value={selectedSemesterId ?? ""}
                onChange={(e) => setSelectedSemesterId(Number(e.target.value))}
              >
                <option value="" disabled>
                  Select Semester
                </option>
                {semesters.map((semester) => (
                  <option
                    key={semester.semester_id}
                    value={semester.semester_id}
                  >
                    Semester {semester.semester_number}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={saveAcademicProfile}
              disabled={savingProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        ) : null}

        {!loading && !error && !needsProfileSetup && rows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
            No datesheet has been generated yet.
          </div>
        ) : null}

        {!loading && !error && !needsProfileSetup && rows.length > 0
          ? Array.from(groupedByExam.entries()).map(([examLabel, examRows]) => (
              <div
                key={examLabel}
                className="bg-white rounded-lg shadow p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {examLabel}
                </h2>

                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-left">
                        Subject Code
                      </th>
                      <th className="border px-4 py-2 text-left">Subject</th>
                      <th className="border px-4 py-2 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examRows.map((row) => (
                      <tr key={row.datesheet_id}>
                        <td className="border px-4 py-2">
                          {formatDateLabel(row.exam_date)}
                        </td>
                        <td className="border px-4 py-2">
                          {row.Subject?.subject_code ?? "-"}
                        </td>
                        <td className="border px-4 py-2">
                          {row.Subject?.subject_name ?? "-"}
                        </td>
                        <td className="border px-4 py-2">
                          {row.TimeSlot
                            ? `${row.TimeSlot.start_time} - ${row.TimeSlot.end_time}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
