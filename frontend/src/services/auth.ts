
import api from "./api";

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    const response = await api.post<AuthResponse>(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    localStorage.setItem(
      "devmind_access_token",
      response.data.access_token
    );

    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("devmind_access_token");
  },
};

export default authService;
