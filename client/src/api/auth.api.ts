import axiosInstance from "./axios.config";

export interface AuthResponse {
  message: string;
  role?: "admin" | "student";
}

export interface MeResponse {
  user: {
    user_id: number;
    email: string;
    role: "admin" | "student";
  };
  profile: {
    branch_id: number;
    semester_id: number;
  } | null;
}

export interface AcademicProfilePayload {
  branch_id: number;
  semester_id: number;
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

  getMe: async (): Promise<MeResponse> => {
    const response = await axiosInstance.get<MeResponse>("/auth/me");
    return response.data;
  },

  updateMyAcademicProfile: async (
    payload: AcademicProfilePayload,
  ): Promise<{
    message: string;
    profile: { branch_id: number; semester_id: number };
  }> => {
    const response = await axiosInstance.put(
      "/auth/my-academic-profile",
      payload,
    );
    return response.data;
  },
};
