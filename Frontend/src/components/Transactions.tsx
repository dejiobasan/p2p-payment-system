import { useTransactionStore } from "../stores/useTransactionStore";
import { useUserStore } from "../stores/useUserStore";
import { useEffect } from "react";
const Transactions = () => {
  const { user } = useUserStore();
  const { transactions, fetchUserTransactions, confirmTransaction } =
    useTransactionStore();
  useEffect(() => {
    if (user) {
      const userId = user.id;
      fetchUserTransactions(userId);
    }
  }, [fetchUserTransactions, user]);
  return (
    <div>
      {transactions.map((txn) => (
        <div key={txn._id} className="border p-4 rounded mb-2">
          <p>From: {txn.senderId.email}</p>
          <p>To: {txn.receiverId.email}</p>
          <p>Amount: ₦{txn.amount}</p>
          <p>Status: {txn.status}</p>
          {txn.status === "pending" && (
            <button
              onClick={() => confirmTransaction(txn._id)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
            >
              Confirm Payment
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Transactions;
