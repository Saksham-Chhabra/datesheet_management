import axiosInstance from "./axios.config";

export interface Semester {
  semester_id?: number;
  semester_number: number;
  year_id: number;
}

export const semesterApi = {
  // Get all semesters
  getAll: async () => {
    const response = await axiosInstance.get<Semester[]>("/semesters");
    return response.data;
  },

  // Get semester by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Semester>(`/semesters/${id}`);
    return response.data;
  },

  // Get semesters by year
  getByYear: async (yearId: number) => {
    const response = await axiosInstance.get<Semester[]>(
      `/semesters/year/${yearId}`,
    );
    return response.data;
  },

  // Create new semester
  create: async (data: Semester) => {
    const response = await axiosInstance.post<Semester>("/semesters", data);
    return response.data;
  },

  // Update semester
  update: async (id: number, data: Semester) => {
    const response = await axiosInstance.put<Semester>(
      `/semesters/${id}`,
      data,
    );
    return response.data;
  },

  // Delete semester
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/semesters/${id}`);
    return response.data;
  },
};
