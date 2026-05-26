
import "./index.css";
import { Route, Routes } from "react-router";
import { LoginPage } from "./Pages/LoginPage";
import { HomePage } from "./Pages/HomePage";
import { RegisterUserPage } from "./Pages/RegisterUserPage";
import { TrackPage } from "./Pages/TrackPage";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { SkyloadLandingPage } from "./Pages/SkyloadLandingPage";
import { TermsPage } from "./Pages/TermsPage";
import { PrivacyPage } from "./Pages/PrivacyPage";

// Motos marketplace
import { MotosProvider } from "./motos/context/MotosContext";
import { LandingPage } from "./motos/pages/LandingPage";
import { SearchPage } from "./motos/pages/SearchPage";
import { DetailPage } from "./motos/pages/DetailPage";
import { LoginPage as MotosLoginPage } from "./motos/pages/LoginPage";
import { RegisterPage as MotosRegisterPage } from "./motos/pages/RegisterPage";
import { UserPanel } from "./motos/pages/UserPanel";
import { MyListingsPage } from "./motos/pages/MyListingsPage";
import { PostMotoPage } from "./motos/pages/PostMotoPage";
import { AdminPage } from "./motos/pages/AdminPage";


function App() {
  return (
    <Routes>
      {/* ── Public / landing routes ── */}
      <Route path="/" element={<SkyloadLandingPage />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route path="/privacidad" element={<PrivacyPage />} />

      {/* ── Fleet routes ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/registerUser" element={<ProtectedRoute><RegisterUserPage /></ProtectedRoute>} />
      <Route path="/track/:driverId" element={<TrackPage />} />

      {/* ── Motos marketplace routes ── */}
      <Route path="/motos/*" element={
        <MotosProvider>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="buscar" element={<SearchPage />} />
            <Route path="moto/:id" element={<DetailPage />} />
            <Route path="login" element={<MotosLoginPage />} />
            <Route path="registro" element={<MotosRegisterPage />} />
            {/* User panel */}
            <Route path="panel" element={<UserPanel />} />
            <Route path="panel/mis-motos" element={<MyListingsPage />} />
            <Route path="panel/publicar" element={<PostMotoPage />} />
            <Route path="panel/editar/:id" element={<PostMotoPage />} />
            {/* Admin */}
            <Route path="admin" element={<AdminPage />} />
          </Routes>
        </MotosProvider>
      } />
    </Routes>
  );
}

export default App;
