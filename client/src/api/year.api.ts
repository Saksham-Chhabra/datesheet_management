import axiosInstance from "./axios.config";

export interface Year {
  year_id?: number;
  year_name: string;
}

export const yearApi = {
  // Get all years
  getAll: async () => {
    const response = await axiosInstance.get<Year[]>("/years");
    return response.data;
  },

  // Get year by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<Year>(`/years/${id}`);
    return response.data;
  },

  // Create new year
  create: async (data: Year) => {
    const response = await axiosInstance.post<Year>("/years", data);
    return response.data;
  },

  // Update year
  update: async (id: number, data: Year) => {
    const response = await axiosInstance.put<Year>(`/years/${id}`, data);
    return response.data;
  },

  // Delete year
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/years/${id}`);
    return response.data;
  },
};
