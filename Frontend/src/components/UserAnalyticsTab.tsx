import { DollarSign } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { Link } from "react-router-dom";

const UserAnalyticsTab = () => {
  const { user } = useUserStore();
  return (
    <div className="p-6">
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
          <Link
            to="/register"
            className="flex items-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-900 transition-all duration-300 mr-4"
          >
            Add Funds
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsTab;
