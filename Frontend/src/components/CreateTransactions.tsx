import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import { useAuthStore } from "../stores/useAuthStore";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
}

const CreateTransactions = () => {
  const { user } = useUserStore();
  const senderId = user?.id;
  const [users, setUsers] = useState<User[]>([]);
  const [receiverId, setReceiverId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = useAuthStore.getState().token;
        const response = await axios.get<User[]>("api/auth/getUsers",{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const sendTransaction = async () => {
    if (!senderId || !receiverId || amount <= 0) {
      toast.error("Please select a recipient and enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post("api/transactions/create", {
        senderId,
        receiverId,
        amount,
      });

      console.log("Transaction Initiated:", response.data);
      toast.success("Transaction Initiated Successfully!");
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast.error("Transaction Failed!");
    }
  };
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Send Money</h2>

      <select
        onChange={(e) => setReceiverId(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-2"
      >
        <option value="">Select a recipient</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />

      <button
        onClick={sendTransaction}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Send Money
      </button>
    </div>
  );
};

export default CreateTransactions;
