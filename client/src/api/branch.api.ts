import axiosInstance from "./axios.config";

export interface Branch {
  branch_id?: number;
  branch_name: string;
  degree_id: number;
}

export const branchApi = {
  // Get all branches
  getAll: async () => {
    const response = await axiosInstance.get<Branch[]>("/branches");
    return response.data;
  },

  // Get branch by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Branch>(`/branches/${id}`);
    return response.data;
  },

  // Get branches by degree
  getByDegree: async (degreeId: number) => {
    const response = await axiosInstance.get<Branch[]>(
      `/branches/degree/${degreeId}`,
    );
    return response.data;
  },

  // Create new branch
  create: async (data: Branch) => {
    const response = await axiosInstance.post<Branch>("/branches", data);
    return response.data;
  },

  // Update branch
  update: async (id: number, data: Branch) => {
    const response = await axiosInstance.put<Branch>(`/branches/${id}`, data);
    return response.data;
  },

  // Delete branch
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/branches/${id}`);
    return response.data;
  },
};
