import axiosInstance from "./axios.config";

export interface Subject {
  subject_id?: number;
  subject_code: string;
  subject_name: string;
  branch_id: number;
  semester_id: number;
}

export const subjectApi = {
  // Get all subjects
  getAll: async () => {
    const response = await axiosInstance.get<Subject[]>("/subjects");
    return response.data;
  },

  // Get subject by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  // Get subjects by branch
  getByBranch: async (branchId: number) => {
    const response = await axiosInstance.get<Subject[]>(
      `/subjects/branch/${branchId}`,
    );
    return response.data;
  },

  // Get subjects by semester
  getBySemester: async (semesterId: number) => {
    const response = await axiosInstance.get<Subject[]>(
      `/subjects/semester/${semesterId}`,
    );
    return response.data;
  },

  // Get subjects by branch and semester
  getByBranchAndSemester: async (branchId: number, semesterId: number) => {
    const response = await axiosInstance.get<Subject[]>(
      `/subjects/branch/${branchId}/semester/${semesterId}`,
    );
    return response.data;
  },

  // Create new subject
  create: async (data: Subject) => {
    const response = await axiosInstance.post<Subject>("/subjects", data);
    return response.data;
  },

  // Update subject
  update: async (id: number, data: Subject) => {
    const response = await axiosInstance.put<Subject>(`/subjects/${id}`, data);
    return response.data;
  },

  // Delete subject
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/subjects/${id}`);
    return response.data;
  },
};
