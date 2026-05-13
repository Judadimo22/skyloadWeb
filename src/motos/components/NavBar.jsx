import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMotos } from "../context/MotosContext";
import { LanguageSwitch } from "../../Components/LanguageSwitch";
import { useLanguage } from "../../context/LanguageContext";
import { Menu, X, Bike, ChevronDown, LogOut, User, LayoutDashboard, Shield } from "lucide-react";

export const NavBar = () => {
  const { motosUser, motosLogout, isMotosAdmin } = useMotos();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    motosLogout();
    navigate("/motos");
    setDropOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/motos" className="flex items-center gap-2.5 font-bold text-xl">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Bike size={18} className="text-white" />
            </div>
            <span>Moto<span className="text-orange-500">Market</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/motos/buscar" className="text-gray-300 hover:text-white transition font-medium">
              {t("mm_nav_browse")}
            </Link>
            <LanguageSwitch compact mode="dark" />
            {motosUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(o => !o)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition font-medium"
                >
                  <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {motosUser.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  {motosUser.name?.split(" ")[0]}
                  <ChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link to="/motos/panel" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                      <LayoutDashboard size={15} /> {t("mm_nav_dashboard")}
                    </Link>
                    <Link to="/motos/panel/publicar" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                      <Bike size={15} /> {t("mm_nav_post")}
                    </Link>
                    {isMotosAdmin && (
                      <Link to="/motos/admin" onClick={() => setDropOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition">
                        <Shield size={15} /> {t("mm_nav_admin")}
                      </Link>
                    )}
                    <div className="border-t my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <LogOut size={15} /> {t("mm_nav_logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/motos/login" className="text-gray-300 hover:text-white transition font-medium">
                  {t("mm_nav_sign_in")}
                </Link>
                <Link to="/motos/registro"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-semibold text-sm">
                  {t("mm_nav_post")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-2">
          <Link to="/motos/buscar" onClick={() => setMenuOpen(false)}
            className="block py-2 text-gray-300 hover:text-white text-sm font-medium">{t("mm_nav_browse")}</Link>
          <div className="py-1">
            <LanguageSwitch mode="dark" />
          </div>
          {motosUser ? (
            <>
              <Link to="/motos/panel" onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white text-sm font-medium">{t("mm_nav_dashboard")}</Link>
              <Link to="/motos/panel/publicar" onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white text-sm font-medium">{t("mm_nav_post")}</Link>
              {isMotosAdmin && (
                <Link to="/motos/admin" onClick={() => setMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-white text-sm font-medium">{t("mm_nav_admin")}</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-400 text-sm font-medium">
                {t("mm_nav_logout")}
              </button>
            </>
          ) : (
            <>
              <Link to="/motos/login" onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white text-sm font-medium">{t("mm_nav_sign_in")}</Link>
              <Link to="/motos/registro" onClick={() => setMenuOpen(false)}
                className="block py-2 text-orange-400 font-semibold text-sm">{t("mm_nav_post_free")}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
