import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  User: {
    id: string;
    username: string;
    email: string;
    balance: number;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface AddFundsData {
  email: string;
  amount: number;
}

interface LoginResponse {
  success: boolean;
  message: string;
  User: {
    id: string;
    username: string;
    email: string;
    balance: number;
  };
  token: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  addFunds: (data: AddFundsData) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,

  register: async (data: RegisterData) => {
    set({ loading: true });
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        "/api/auth/register",
        data
      );
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering");
    }
  },

  login: async (data: LoginData) => {
    const { setToken } = useAuthStore.getState();
    set({ loading: true });
    try {
      const response = await axios.post<LoginResponse>("api/auth/login", data, {
        withCredentials: true,
      });
      if (response.data.success) {
        set({ user: response.data.User, loading: false });
        setToken(response.data.token);
        toast.success(`Welcome ${response.data.User.username}!`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
    set({ loading: false });
  },

  logout: async () => {
    try {
      const { setToken } = useAuthStore.getState();
      setToken("");
      set({ user: null, loading: false });
      toast.success("User logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  },

  addFunds: async (data:  AddFundsData) => {
    set({ loading: true });
    try {
      const response = await axios.post("/api/auth/addFunds", data);
      if (response.data.success) {
        set({ user: response.data.newBalance, loading: false });
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while adding funds");
    }
  }
}));
