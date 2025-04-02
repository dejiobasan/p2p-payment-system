import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/RegisterPage";
import { useUserStore } from "./stores/useUserStore";
import UserDashboard from "./pages/UserDashboard";

function App() {
  const { user } = useUserStore();

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={
            !user ? <Registerpage /> : <Navigate to={"/userdashboard"} />
          }
        />
        <Route
          path="/login"
          element={!user ? <Loginpage /> : <Navigate to={"/userdashboard"} />}
        />
        <Route
          path="/userdashboard"
          element={user ? <UserDashboard /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
