import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LogOut, Map, Users, Search, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UsersList } from "../Users/Users";
import { Loads } from "../Loads/Loads";
import { AdminsPanel } from "../Admins/Admins";

const SUPERADMIN_EMAILS = [
  "diazmorenodavid16@gmail.com",
  "vlad.k@southpointegroup.net",
];

function getCurrentEmail() {
  try {
    const token = localStorage.getItem("loginToken");
    if (!token) return "";
    const decoded = jwtDecode(token);
    return decoded.email || "";
  } catch {
    return "";
  }
}

export const Home = () => {

  const [section, setSection] = useState("cargas");
  const [unitFilter, setUnitFilter] = useState("");
  const navigate = useNavigate();

  const currentEmail = getCurrentEmail();
  const isSuperAdmin = SUPERADMIN_EMAILS.includes(currentEmail);

  const NAV_ITEMS = [
    { id: "cargas",   label: "Live Map", icon: Map   },
    { id: "usuarios", label: "Drivers",  icon: Users },
    ...(isSuperAdmin ? [{ id: "admins", label: "Admins", icon: ShieldCheck }] : []),
  ];

  const logout = () => {
    localStorage.removeItem("loginToken");
    localStorage.removeItem("roles");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30">
              <Map size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Fleetpoint 360</h1>
              <p className="text-xs text-slate-500 leading-tight">
                {isSuperAdmin ? "Super Admin" : "Admin Panel"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 pb-2 space-y-0.5">

          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2.5">
            Navigation
          </p>

          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                section === id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}

        </nav>

        {/* Current user */}
        {currentEmail && (
          <div className="px-4 py-3 border-t border-slate-800">
            <p className="text-[10px] text-slate-600 truncate">{currentEmail}</p>
            {isSuperAdmin && (
              <p className="text-[10px] text-blue-400 font-semibold mt-0.5">Super Admin</p>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all font-medium"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

      </aside>

      {/* ── Content ── */}
      {section === "cargas" ? (

        <main className="flex-1 overflow-hidden">
          <Loads />
        </main>

      ) : section === "admins" && isSuperAdmin ? (

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="bg-white border-b px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Administrators</h2>
              <p className="text-xs text-gray-500 mt-0.5">Create and manage admin accounts</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
              <ShieldCheck size={13} className="text-blue-500" />
              <span className="text-xs font-semibold text-blue-600">Super Admin</span>
            </div>
          </div>
          <div className="p-8">
            <AdminsPanel currentEmail={currentEmail} />
          </div>
        </main>

      ) : (

        <main className="flex-1 overflow-auto bg-white">

          {/* Page header */}
          <div className="bg-white border-b px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Drivers</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage your fleet drivers and assign loads</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-xs font-semibold text-blue-600">Fleet Active</span>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-white rounded-xl">

              {/* Search bar */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="relative max-w-xs">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by unit number..."
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <UsersList unitFilter={unitFilter} />
            </div>
          </div>

        </main>

      )}

    </div>
  );
};
