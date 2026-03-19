import axiosInstance from "./axios.config";

export interface AuthResponse {
  message: string;
  role?: "admin" | "student";
}

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get<AuthResponse>("/auth/logout");
    return response.data;
  },
};
