import { useState } from "react";
import {
  Handshake,
  LayoutDashboard,
  WalletMinimal,
  WalletCards,
  ContactRound,
  LogOut,
  UserRound,
} from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { Link } from "react-router-dom";
import UserAnalyticsTab from "../UserAnalyticsTab";
import CreateTransactions from "../CreateTransactions";
import Transactions from "../Transactions";
import ContactAdmin from "../ContactAdmin";

const sidebarItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
  { name: "Transactions", icon: <WalletMinimal size={20} /> },
  { name: "Create Transaction", icon: <WalletCards size={20} /> },
  { name: "Contact Admin", icon: <ContactRound size={20} /> },
];

const Sidenav = () => {
  const [active, setActive] = useState("Dashboard");
  const { user, logout } = useUserStore();

  const renderComponent = () => {
    switch (active) {
      case "Dashboard":
        return <UserAnalyticsTab/>;
      case "Transactions":
        return <Transactions />;
      case "Create Transaction":
        return <CreateTransactions />;
      case "Contact Admin":
        return <ContactAdmin />;
      default:
        return <UserAnalyticsTab />;
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <div className="mb-6">
          <Link to="/">
            <Handshake color="white" className="h-16 w-16" />
          </Link>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg text-left ${
                active === item.name ? "bg-blue-500" : "hover:bg-blue-900"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-auto px-6 py-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-900 rounded-md w-full text-left"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between bg-white shadow-sm p-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-indigo-300"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserRound size={40} className="bg-blue-700"  color="white"/>
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
          </div>
        </header>

        <main className="p-6">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default Sidenav;
