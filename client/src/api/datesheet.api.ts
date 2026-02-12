import axiosInstance from "./axios.config";

export interface DateSheet {
  datesheet_id?: number;
  exam_date: string;
  subject_id: number;
  exam_id: number;
  slot_id: number;
}

export const datesheetApi = {
  // Get all datesheets
  getAll: async () => {
    const response = await axiosInstance.get<DateSheet[]>("/datesheets");
    return response.data;
  },

  // Get datesheet by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<DateSheet>(`/datesheets/${id}`);
    return response.data;
  },

  // Get datesheets by exam
  getByExam: async (examId: number) => {
    const response = await axiosInstance.get<DateSheet[]>(
      `/datesheets/exam/${examId}`,
    );
    return response.data;
  },

  // Get datesheets by subject
  getBySubject: async (subjectId: number) => {
    const response = await axiosInstance.get<DateSheet[]>(
      `/datesheets/subject/${subjectId}`,
    );
    return response.data;
  },

  // Create new datesheet
  create: async (data: DateSheet) => {
    const response = await axiosInstance.post<DateSheet>("/datesheets", data);
    return response.data;
  },

  // Update datesheet
  update: async (id: number, data: DateSheet) => {
    const response = await axiosInstance.put<DateSheet>(
      `/datesheets/${id}`,
      data,
    );
    return response.data;
  },

  // Delete datesheet
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/datesheets/${id}`);
    return response.data;
  },

  // Generate datesheet for an exam
  generate: async (examId: number, options?: any) => {
    const response = await axiosInstance.post(
      `/datesheets/generate/${examId}`,
      options,
    );
    return response.data;
  },
};
