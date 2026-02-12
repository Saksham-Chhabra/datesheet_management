import axiosInstance from "./axios.config";

export interface TimeSlot {
  slot_id?: number;
  start_time: string;
  end_time: string;
}

export const timeSlotApi = {
  // Get all time slots
  getAll: async () => {
    const response = await axiosInstance.get<TimeSlot[]>("/timeslots");
    return response.data;
  },

  // Get time slot by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<TimeSlot>(`/timeslots/${id}`);
    return response.data;
  },

  // Create new time slot
  create: async (data: TimeSlot) => {
    const response = await axiosInstance.post<TimeSlot>("/timeslots", data);
    return response.data;
  },

  // Update time slot
  update: async (id: number, data: TimeSlot) => {
    const response = await axiosInstance.put<TimeSlot>(
      `/timeslots/${id}`,
      data,
    );
    return response.data;
  },

  // Delete time slot
  delete: async (id: number) => {
    const response = await axiosInstance.delete(`/timeslots/${id}`);
    return response.data;
  },
};
