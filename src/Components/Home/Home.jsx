import { useState } from "react";
import { LogOut, Truck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UsersList } from "../Users/Users";
import { Loads } from "../Loads/Loads";


export const Home = () => {

  const [section, setSection] = useState("cargas");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("roles");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0">

        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Truck size={14} className="text-white" />
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Skyload Admin
            </h1>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Navigation
          </p>

          <button
            onClick={() => setSection("cargas")}
            className={`cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              section === "cargas"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Truck size={16} />
            Manage Loads
          </button>

          <button
            onClick={() => setSection("usuarios")}
            className={`cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              section === "usuarios"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users size={16} />
            Manage Users
          </button>

        </nav>

        <div className="px-3 py-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="cursor-pointer flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </aside>

      {/* CONTENT */}
      {section === "cargas" ? (

        <main className="flex-1 overflow-hidden">
          <Loads />
        </main>

      ) : (

        <main className="flex-1 p-8 overflow-auto bg-gray-100">

          <header className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
            <p className="text-sm text-gray-500 mt-0.5">View and manage your drivers</p>
          </header>

          <div className="bg-white rounded-xl shadow-sm border">
            <UsersList />
          </div>

        </main>

      )}

    </div>
  );
};
