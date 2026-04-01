import axiosInstance from "./axios.config";

export interface DateSheet {
  datesheet_id?: number;
  exam_date: string;
  subject_id: number;
  exam_id: number;
  slot_id: number;
}

export interface DateSheetRecord extends DateSheet {
  Subject?: {
    subject_id: number;
    subject_code: string;
    subject_name: string;
    branch_id: number;
    semester_id: number;
  };
  Exam?: {
    exam_id: number;
    exam_type: string;
    academic_year: string;
  };
  TimeSlot?: {
    slot_id: number;
    start_time: string;
    end_time: string;
  };
}

export interface GenerateDateSheetPayload {
  branch_id: number;
  semester_id: number;
  slot_id: number;
  start_date: string;
  end_date: string;
  exam_type: string;
  academic_year: string;
}

export interface GenerateDateSheetResponse {
  message: string;
  exam: {
    exam_id: number;
    exam_type: string;
    academic_year: string;
  };
  count: number;
  datesheet: DateSheetRecord[];
}

export const datesheetApi = {
  // Get all datesheets
  getAll: async () => {
    const response = await axiosInstance.get<DateSheetRecord[]>("/datesheets");
    return response.data;
  },

  // Get datesheet for logged-in student only
  getMy: async () => {
    const response =
      await axiosInstance.get<DateSheetRecord[]>("/datesheets/my");
    return response.data;
  },

  // Get datesheet by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<DateSheetRecord>(
      `/datesheets/${id}`,
    );
    return response.data;
  },

  // Get datesheets by exam
  getByExam: async (examId: number) => {
    const response = await axiosInstance.get<DateSheetRecord[]>(
      `/datesheets/exam/${examId}`,
    );
    return response.data;
  },

  // Get datesheets by subject
  getBySubject: async (subjectId: number) => {
    const response = await axiosInstance.get<DateSheetRecord[]>(
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
  generate: async (payload: GenerateDateSheetPayload, examId?: number) => {
    const endpoint = examId
      ? `/datesheets/generate/${examId}`
      : "/datesheets/generate";
    const response = await axiosInstance.post<GenerateDateSheetResponse>(
      endpoint,
      payload,
    );
    return response.data;
  },
};
