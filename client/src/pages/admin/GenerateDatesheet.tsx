import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  branchApi,
  datesheetApi,
  degreeApi,
  semesterApi,
  timeSlotApi,
  type Branch,
  type DateSheetRecord,
  type Degree,
  type Semester,
  type TimeSlot,
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

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeSlot(slot?: TimeSlot | DateSheetRecord["TimeSlot"]) {
  if (!slot) return "-";
  return `${slot.start_time} - ${slot.end_time}`;
}

export default function GenerateDatesheet() {
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [generatedRows, setGeneratedRows] = useState<DateSheetRecord[]>([]);

  const [selectedDegreeId, setSelectedDegreeId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(
    null,
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [examType, setExamType] = useState("Final");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loadingFilters, setLoadingFilters] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredBranches = useMemo(() => {
    if (!selectedDegreeId) return [];
    return branches.filter(
      (branch) => Number(branch.degree_id) === selectedDegreeId,
    );
  }, [branches, selectedDegreeId]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingFilters(true);
        setError("");

        const [degreeResult, branchResult, semesterResult, slotResult] =
          await Promise.allSettled([
            degreeApi.getAll(),
            branchApi.getAll(),
            semesterApi.getAll(),
            timeSlotApi.getAll(),
          ]);

        const degreeData =
          degreeResult.status === "fulfilled" ? degreeResult.value : [];
        const branchData =
          branchResult.status === "fulfilled" ? branchResult.value : [];
        const semesterData =
          semesterResult.status === "fulfilled" ? semesterResult.value : [];
        const slotData =
          slotResult.status === "fulfilled" ? slotResult.value : [];

        setDegrees(degreeData);
        setBranches(branchData);
        setSemesters(semesterData);
        setSlots(slotData);

        const failedSources: string[] = [];
        if (degreeResult.status === "rejected") failedSources.push("degrees");
        if (branchResult.status === "rejected") failedSources.push("branches");
        if (semesterResult.status === "rejected")
          failedSources.push("semesters");
        if (slotResult.status === "rejected") failedSources.push("time slots");

        if (failedSources.length > 0) {
          setError(
            `Some data could not be loaded: ${failedSources.join(", ")}. Check backend routes and refresh.`,
          );
        }

        const firstDegreeId = degreeData[0]?.degree_id
          ? Number(degreeData[0].degree_id)
          : null;
        setSelectedDegreeId(firstDegreeId);

        const initialBranch = branchData.find(
          (branch) => Number(branch.degree_id) === firstDegreeId,
        );
        setSelectedBranchId(
          initialBranch?.branch_id ? Number(initialBranch.branch_id) : null,
        );

        setSelectedSemesterId(
          semesterData[0]?.semester_id
            ? Number(semesterData[0].semester_id)
            : null,
        );
        setSelectedSlotId(
          slotData[0]?.slot_id ? Number(slotData[0].slot_id) : null,
        );
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load filters"));
      } finally {
        setLoadingFilters(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedDegreeId) {
      setSelectedBranchId(null);
      return;
    }

    const firstForDegree = branches.find(
      (branch) => Number(branch.degree_id) === selectedDegreeId,
    );

    if (!firstForDegree) {
      setSelectedBranchId(null);
      return;
    }

    if (
      !selectedBranchId ||
      Number(firstForDegree.degree_id) !== selectedDegreeId
    ) {
      setSelectedBranchId(Number(firstForDegree.branch_id));
    }
  }, [selectedDegreeId, branches, selectedBranchId]);

  const onGenerate = async () => {
    if (
      !selectedBranchId ||
      !selectedSemesterId ||
      !selectedSlotId ||
      !startDate ||
      !endDate ||
      !examType.trim() ||
      !academicYear.trim()
    ) {
      setError("Please fill all fields before generating the datesheet.");
      setSuccess("");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const response = await datesheetApi.generate({
        branch_id: selectedBranchId,
        semester_id: selectedSemesterId,
        slot_id: selectedSlotId,
        start_date: startDate,
        end_date: endDate,
        exam_type: examType,
        academic_year: academicYear,
      });

      setGeneratedRows(response.datesheet);
      setSuccess(
        `${response.count} entries generated for ${response.exam.exam_type} (${response.exam.academic_year}).`,
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to generate datesheet"));
      setGeneratedRows([]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Generate Datesheet
        </h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {loadingFilters ? (
            <p className="text-sm text-gray-500">Loading academic data...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  className="border px-4 py-2 rounded-md"
                  value={selectedDegreeId ?? ""}
                  onChange={(e) => setSelectedDegreeId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select Degree
                  </option>
                  {degrees.length === 0 && (
                    <option value="" disabled>
                      No degrees available
                    </option>
                  )}
                  {degrees.map((degree) => (
                    <option key={degree.degree_id} value={degree.degree_id}>
                      {degree.degree_name}
                    </option>
                  ))}
                </select>

                <select
                  className="border px-4 py-2 rounded-md"
                  value={selectedBranchId ?? ""}
                  onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Select Branch
                  </option>
                  {filteredBranches.length === 0 && (
                    <option value="" disabled>
                      No branches available
                    </option>
                  )}
                  {filteredBranches.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>

                <select
                  className="border px-4 py-2 rounded-md"
                  value={selectedSemesterId ?? ""}
                  onChange={(e) =>
                    setSelectedSemesterId(Number(e.target.value))
                  }
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  {semesters.length === 0 && (
                    <option value="" disabled>
                      No semesters available
                    </option>
                  )}
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  className="border px-4 py-2 rounded-md"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  placeholder="Exam Type (Midterm/Final)"
                />

                <input
                  type="text"
                  className="border px-4 py-2 rounded-md"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="Academic Year (e.g. 2025-26)"
                />

                <input
                  type="date"
                  className="border px-4 py-2 rounded-md"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <input
                  type="date"
                  className="border px-4 py-2 rounded-md"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select
                  className="border px-4 py-2 rounded-md"
                  value={selectedSlotId ?? ""}
                  onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Time Slots
                  </option>
                  {slots.length === 0 && (
                    <option value="" disabled>
                      No time slots available
                    </option>
                  )}
                  {slots.map((slot) => (
                    <option key={slot.slot_id} value={slot.slot_id}>
                      {formatTimeSlot(slot)}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              {success && (
                <p className="text-sm text-green-700 mb-4">{success}</p>
              )}

              <div className="text-right">
                <button
                  onClick={onGenerate}
                  disabled={generating}
                  className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                  {generating ? "Generating..." : "Generate Datesheet"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Generated Datesheet
          </h2>

          {!generatedRows.length ? (
            <p className="text-sm text-gray-500">No datesheet generated yet.</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Date</th>
                  <th className="border px-4 py-2 text-left">Time</th>
                  <th className="border px-4 py-2 text-left">Subject Code</th>
                  <th className="border px-4 py-2 text-left">Subject</th>
                </tr>
              </thead>
              <tbody>
                {generatedRows.map((row) => (
                  <tr key={row.datesheet_id}>
                    <td className="border px-4 py-2">
                      {formatDateLabel(row.exam_date)}
                    </td>
                    <td className="border px-4 py-2">
                      {formatTimeSlot(row.TimeSlot)}
                    </td>
                    <td className="border px-4 py-2">
                      {row.Subject?.subject_code ?? "-"}
                    </td>
                    <td className="border px-4 py-2">
                      {row.Subject?.subject_name ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
