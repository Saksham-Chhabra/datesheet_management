import axiosInstance from "./axios.config";

export interface Exam {
  exam_id?: number;
  exam_type: string;
  academic_year: string;
}

export const examApi = {
  // Get all exams
  getAll: async () => {
    const response = await axiosInstance.get<Exam[]>("/exams");
    return response.data;
  },

  // Get exam by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Exam>(`/exams/${id}`);
    return response.data;
  },

  // Get exams by type
  getByType: async (examType: string) => {
    const response = await axiosInstance.get<Exam[]>(`/exams/type/${examType}`);
    return response.data;
  },

  // Get exams by academic year
  getByAcademicYear: async (academicYear: string) => {
    const response = await axiosInstance.get<Exam[]>(
      `/exams/year/${academicYear}`,
    );
    return response.data;
  },

  // Create new exam
  create: async (data: Exam) => {
    const response = await axiosInstance.post<Exam>("/exams", data);
    return response.data;
  },

  // Update exam
  update: async (id: number, data: Exam) => {
    const response = await axiosInstance.put<Exam>(`/exams/${id}`, data);
    return response.data;
  },

  // Delete exam
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/exams/${id}`);
    return response.data;
  },
};
