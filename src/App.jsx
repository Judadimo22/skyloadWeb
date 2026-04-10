
import "./index.css";
import { Route, Routes } from "react-router";
import { LoginPage } from "./Pages/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { RegisterUserPage } from "./Pages/RegisterUserPage";
import { TrackPage } from "./Pages/TrackPage";
import { ProtectedRoute } from "./Components/ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/registerUser" element={<ProtectedRoute><RegisterUserPage /></ProtectedRoute>} />
      <Route path="/track/:driverId" element={<TrackPage />} />
    </Routes>
  );
}

export default App;
