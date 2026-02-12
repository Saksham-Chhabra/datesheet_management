import axiosInstance from "./axios.config";

export interface Degree {
  degree_id?: number;
  degree_name: string;
  department_id: number;
}

export const degreeApi = {
  // Get all degrees
  getAll: async () => {
    const response = await axiosInstance.get<Degree[]>("/degrees");
    return response.data;
  },

  // Get degree by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Degree>(`/degrees/${id}`);
    return response.data;
  },

  // Get degrees by department
  getByDepartment: async (departmentId: number) => {
    const response = await axiosInstance.get<Degree[]>(
      `/degrees/department/${departmentId}`,
    );
    return response.data;
  },

  // Create new degree
  create: async (data: Degree) => {
    const response = await axiosInstance.post<Degree>("/degrees", data);
    return response.data;
  },

  // Update degree
  update: async (id: number, data: Degree) => {
    const response = await axiosInstance.put<Degree>(`/degrees/${id}`, data);
    return response.data;
  },

  // Delete degree
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/degrees/${id}`);
    return response.data;
  },
};
