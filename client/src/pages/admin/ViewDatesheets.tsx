import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  branchApi,
  datesheetApi,
  semesterApi,
  type Branch,
  type DateSheetRecord,
  type Semester,
} from "../../api";

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

export default function ViewDatesheets() {
  const [datasheets, setDatesheets] = useState<DateSheetRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [activeExamTab, setActiveExamTab] = useState<"Mid" | "Final">("Mid");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ds, brs, sems] = await Promise.all([
          datesheetApi.getAll(),
          branchApi.getAll(),
          semesterApi.getAll(),
        ]);

        setDatesheets(ds);
        setBranches(brs);
        setSemesters(sems);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load datasheets"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBranches = useMemo(() => {
    return branches;
  }, [branches]);

  const filteredDatesheets = useMemo(() => {
    const filtered = datasheets.filter((ds) => {
      const examTypeStr = ds.Exam?.exam_type?.toLowerCase() || "";
      const matchExamType =
        activeExamTab === "Mid"
          ? examTypeStr.includes("mid")
          : examTypeStr.includes("final") || examTypeStr.includes("end");

      if (!matchExamType) return false;

      if (selectedBranch && ds.Subject?.branch_id !== selectedBranch)
        return false;
      if (selectedSemester && ds.Subject?.semester_id !== selectedSemester)
        return false;

      return true;
    });

    return filtered.sort(
      (a, b) =>
        new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime(),
    );
  }, [datasheets, activeExamTab, selectedBranch, selectedSemester]);

  const groupedDatesheets = useMemo(() => {
    const groups: Record<string, DateSheetRecord[]> = {};

    for (const ds of filteredDatesheets) {
      const dateKey = ds.exam_date || "Unknown";
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(ds);
    }

    return groups;
  }, [filteredDatesheets]);

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          View Datasheets
        </h1>

        <div className="bg-white p-6 rounded shadow">
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          {loading ? (
            <p className="text-sm text-gray-500">Loading datasheets...</p>
          ) : (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                Total datasheets loaded: {datasheets.length} | Filtered:{" "}
                {filteredDatesheets.length}
              </div>

              <div className="flex gap-3 mb-6 flex-wrap">
                <select
                  value={selectedBranch ?? ""}
                  onChange={(e) =>
                    setSelectedBranch(Number(e.target.value) || null)
                  }
                  className="border px-3 py-2 rounded text-sm"
                >
                  <option value="">All Branches</option>
                  {filteredBranches.map((b) => (
                    <option key={b.branch_id} value={b.branch_id}>
                      {b.branch_name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSemester ?? ""}
                  onChange={(e) =>
                    setSelectedSemester(Number(e.target.value) || null)
                  }
                  className="border px-3 py-2 rounded text-sm"
                >
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s.semester_id} value={s.semester_id}>
                      Semester {s.semester_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 border-b mb-6">
                {["Mid", "Final"].map((examType) => (
                  <button
                    key={examType}
                    onClick={() =>
                      setActiveExamTab(examType as "Mid" | "Final")
                    }
                    className={`pb-2 text-sm font-medium transition ${
                      activeExamTab === examType
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {examType} Semester Datasheets
                  </button>
                ))}
              </div>

              {filteredDatesheets.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No {activeExamTab} semester datasheets found for selected
                  filters.
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedDatesheets).map(
                    ([dateKey, entries]) => (
                      <div
                        key={dateKey}
                        className="border rounded p-4 bg-gray-50"
                      >
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Date: {new Date(dateKey).toLocaleDateString("en-IN")}
                        </h3>

                        <table className="w-full border text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border px-3 py-2 text-left">
                                Subject Code
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Subject Name
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Branch
                              </th>
                              <th className="border px-3 py-2 text-left">
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((entry) => (
                              <tr key={entry.datesheet_id}>
                                <td className="border px-3 py-2">
                                  {entry.Subject?.subject_code || "-"}
                                </td>
                                <td className="border px-3 py-2">
                                  {entry.Subject?.subject_name || "-"}
                                </td>
                                <td className="border px-3 py-2">
                                  {branches.find(
                                    (b) =>
                                      b.branch_id === entry.Subject?.branch_id,
                                  )?.branch_name || "-"}
                                </td>
                                <td className="border px-3 py-2">
                                  {entry.TimeSlot
                                    ? `${entry.TimeSlot.start_time} - ${entry.TimeSlot.end_time}`
                                    : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
