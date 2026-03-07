import { useState } from "react";
import { LogOut, Truck, Users, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UsersList } from "../Users/Users";
import { Loads } from "../Loads/Loads";


export const  Home = () => {

  const [section, setSection] = useState("cargas");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("roles");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">

        <div className="p-6 border-b">
          <h1 className="text-xl font-semibold text-gray-800">
            Skyload Admin
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <button
            onClick={() => setSection("cargas")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition 
            ${section === "cargas"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"}`}
          >
            <Truck size={18} />
Manage loads
          </button>

          <button
            onClick={() => setSection("usuarios")}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition 
            ${section === "usuarios"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"}`}
          >
            <Users size={18} />
            Manage Users
          </button>

        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">

        <header className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            {section === "cargas"
              ? "Manage loads"
              : "Manage Users"}
          </h2>
        </header>

        <div className="bg-white p-6 rounded-xl shadow">

          {section === "cargas" && (
            <p className="text-gray-600">
              <Loads/>
            </p>
          )}

          {section === "usuarios" && (
            <p className="text-gray-600">
              <UsersList/>
            </p>
          )}

        </div>

      </main>

    </div>
  );
}