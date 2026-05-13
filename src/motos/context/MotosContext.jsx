import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const MotosContext = createContext(null);

export const MotosProvider = ({ children }) => {
  const [motosUser, setMotosUser] = useState(null);
  const [motosLoading, setMotosLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("motosToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setMotosUser(decoded);
        } else {
          localStorage.removeItem("motosToken");
        }
      } catch {
        localStorage.removeItem("motosToken");
      }
    }
    setMotosLoading(false);
  }, []);

  const motosLogin = (token) => {
    localStorage.setItem("motosToken", token);
    try { setMotosUser(jwtDecode(token)); } catch { /* ignore */ }
  };

  const motosLogout = () => {
    localStorage.removeItem("motosToken");
    setMotosUser(null);
  };

  const isMotosAdmin = motosUser?.role === "admin";

  return (
    <MotosContext.Provider value={{ motosUser, motosLoading, motosLogin, motosLogout, isMotosAdmin }}>
      {children}
    </MotosContext.Provider>
  );
};

export const useMotos = () => useContext(MotosContext);
