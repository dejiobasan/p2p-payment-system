import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

interface Transaction {
  _id: string;
  senderId: {
    _id: string;
    email: string;
  };
  receiverId: {
    _id: string;
    email: string;
  };
  amount: number;
  status: string;
}

interface Response {
  message: string;
}

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  fetchUserTransactions: (userId: string) => Promise<void>;
  confirmTransaction: (id: string) => Promise<void>;
  setTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  loading: false,

  setTransactions: (transactions: Transaction[]) => set({ transactions }),

  fetchUserTransactions: async (userId: string) => {
    try {
      set({ loading: true });
      const token = useAuthStore.getState().token;
      const response = await axios.get<Transaction[]>(
        `/api/transactions/userTransactions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ transactions: response.data });
    } catch (error) {
      toast.error("Failed to fetch transactions");
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  confirmTransaction: async (id: string) => {
    try {
      const token = useAuthStore.getState().token;
      const response = await axios.put<Response>(
        `/api/transactions/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to confirm transaction");
      console.error(error);
    }
  },
}));
