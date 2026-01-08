import api from "./api";

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Appointment {
  id?: number;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
  };
  appointmentDateTime: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  userId: number;
  appointmentDateTime: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  userId?: number;
  appointmentDateTime?: string;
  notes?: string;
  status?: AppointmentStatus;
}

// GET all appointments
export const getAllAppointments = async () => {
  const response = await api.get<Appointment[]>("/appointments");
  return response.data;
};

// GET appointment by ID
export const getAppointmentById = async (id: number) => {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
};

// GET appointments by user ID
export const getAppointmentsByUserId = async (userId: number) => {
  const response = await api.get<Appointment[]>(`/appointments/user/${userId}`);
  return response.data;
};

// GET appointments by status
export const getAppointmentsByStatus = async (status: AppointmentStatus) => {
  const response = await api.get<Appointment[]>(`/appointments/status/${status}`);
  return response.data;
};

// GET appointments by date
export const getAppointmentsByDate = async (date: string) => {
  const response = await api.get<Appointment[]>(`/appointments/date/${date}`);
  return response.data;
};

// GET appointments in date range
export const getAppointmentsInRange = async (startDate: string, endDate: string) => {
  const response = await api.get<Appointment[]>(`/appointments/range`, {
    params: { startDate, endDate },
  });
  return response.data;
};

// CHECK availability
export const checkAvailability = async (dateTime: string) => {
  const response = await api.get<boolean>(`/appointments/availability`, {
    params: { dateTime },
  });
  return response.data;
};

// CREATE appointment
export const createAppointment = async (request: CreateAppointmentRequest) => {
  const response = await api.post<Appointment>("/appointments", request);
  return response.data;
};

// UPDATE appointment
export const updateAppointment = async (id: number, request: UpdateAppointmentRequest) => {
  const response = await api.put<Appointment>(`/appointments/${id}`, request);
  return response.data;
};

// CANCEL appointment
export const cancelAppointment = async (id: number) => {
  const response = await api.put<Appointment>(`/appointments/${id}/cancel`);
  return response.data;
};

// COMPLETE appointment
export const completeAppointment = async (id: number) => {
  const response = await api.put<Appointment>(`/appointments/${id}/complete`);
  return response.data;
};

// DELETE appointment
export const deleteAppointment = async (id: number) => {
  await api.delete(`/appointments/${id}`);
};
