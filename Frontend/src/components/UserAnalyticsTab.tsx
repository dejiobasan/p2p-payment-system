import { useState } from "react";
import { DollarSign } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserAnalyticsTab = () => {
  const { user, addFunds } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  interface FlutterWaveResponse {
    status: string;
    transaction_id: number;
    tx_ref: string;
  }

  interface Customizations {
    title: string;
    description: string;
    logo: string;
  }

  interface Config {
    public_key: string;
    tx_ref: string;
    amount: number;
    currency: string;
    payment_options: string;
    customer: {
      email: string;
      name: string;
      phone_number: string;
    };
    customizations: Customizations;
  }

  interface FWConfig extends Config {
    text: string;
    callback: (response: FlutterWaveResponse) => void;
    onClose: () => void;
  }
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLICKEY, //Input your Flutterwave public key here.
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email || "",
      name: user?.username || "",
      phone_number: "null",
    },
    customizations: {
      title: "Peer to Peer",
      description: "Add funds to my account",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fwConfig: FWConfig = {
    ...config,
    text: "Pay with Flutterwave!",
    callback: async (response: FlutterWaveResponse) => {
      if (response.status !== "completed") {
        console.log("Transaction was not completed!");
      } else {
        try {
          await addFunds({
            email: user?.email || "",
            amount: amount,
          });
          toast.success("Funds added successfully!");
          navigate("/userdashboard");
        } catch (error) {
          console.error("Error adding funds:", error);
        }
        console.log("Transaction was successful!");
      }
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {
      navigate("/userdashboard");
      console.log("Transaction was closed!");
    },
  };

  return (
    <>
      <div className={`p-6 ${isModalOpen ? "blur-sm" : ""}`}>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-500 text-xl">
                <DollarSign />
              </span>
            </div>
            <div className="ml-6">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-lg font-semibold">&#8358;{user?.balance}</p>
            </div>
          </div>
          <div className="w-[150px] flex justify-between items-center">
            <button
              onClick={toggleModal}
              className="flex items-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-all duration-300 mr-4"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Funds</h2>
            <form>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                placeholder="Enter amount"
                onChange={handleInputChange}
                value={amount}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <FlutterWaveButton
                  {...fwConfig}
                  className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAnalyticsTab;
