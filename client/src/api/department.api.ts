import axiosInstance from "./axios.config";

export interface Department {
  department_id?: number;
  department_name: string;
}

export const departmentApi = {
  // Get all departments
  getAll: async () => {
    const response = await axiosInstance.get<Department[]>("/departments");
    return response.data;
  },

  // Get department by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Department>(`/departments/${id}`);
    return response.data;
  },

  // Create new department
  create: async (data: Department) => {
    const response = await axiosInstance.post<Department>("/departments", data);
    return response.data;
  },

  // Update department
  update: async (id: number, data: Department) => {
    const response = await axiosInstance.put<Department>(
      `/departments/${id}`,
      data,
    );
    return response.data;
  },

  // Delete department
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/departments/${id}`);
    return response.data;
  },
};
