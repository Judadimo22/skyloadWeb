
import "./index.css";
import { Route, Routes } from "react-router";
import { LoginPage } from "./Pages/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { RegisterUserPage } from "./Pages/RegisterUserPage";




function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/registerUser" element={<RegisterUserPage/>} />
    </Routes>
  );
}

export default App;