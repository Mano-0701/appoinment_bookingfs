import api from "./api";

export interface User {
  id?: number;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  phoneNumber: string;
  email: string;
}

// GET all users
export const getAllUsers = async () => {
  const response = await api.get<User[]>("/users");
  return response.data;
};

// CREATE user
export const createUser = async (request: CreateUserRequest) => {
  const response = await api.post<User>("/users", request);
  return response.data;
};

// DELETE user  ✅ NEW (added safely)
export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};

// UPDATE user
export const updateUser = async (id: number, user: User) => {
  const response = await api.put<User>(`/users/${id}`, user);
  return response.data;
};


