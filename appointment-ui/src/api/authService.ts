import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginApi = async (data: LoginRequest) => {
  const response = await api.post("/auth/login", data);
  return response.data; // { token: "..." }
};
