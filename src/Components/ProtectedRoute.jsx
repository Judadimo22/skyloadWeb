import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("loginToken");
  if (!token) return <Navigate to="/" replace />;
  return children;
};
