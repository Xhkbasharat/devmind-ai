
import { create } from "zustand";
import authService, { type User } from "../services/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: Boolean(
    localStorage.getItem("devmind_access_token")
  ),
  isLoading: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  loadUser: async () => {
    const token = localStorage.getItem("devmind_access_token");

    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true });

    try {
      const user = await authService.getCurrentUser();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      authService.logout();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: () => {
    authService.logout();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

export default useAuthStore;
