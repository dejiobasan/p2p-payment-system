import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/RegisterPage";
function App() {
  const user = null;
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/register"
          element={!user ? <Registerpage /> : <Navigate to={"/userdashboard"} />}
        />
        <Route
          path="/login"
          element={!user ? <Loginpage /> : <Navigate to={"/userdashboard"} />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
