import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "../Logo/Logo";
import { LanguageSwitch } from "../LanguageSwitch";
import { useLanguage } from "../../context/LanguageContext";

export const LandingNavBar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { t } = useLanguage();

  const isLegal = pathname === "/terminos" || pathname === "/privacidad";

  const NAV_LINKS = [
    { label: t("lp_nav_home"),     to: "/#" },
    { label: t("lp_nav_services"), to: "/#servicios" },
    { label: t("lp_nav_features"), to: "/#plataformas" },
    { label: t("lp_nav_contact"),  to: "/#contacto" },
  ];

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
              <Logo w={28} h={28} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Fleet Point <span className="text-blue-400 font-normal">360</span>
            </span>
          </Link>

          {/* Desktop links */}
          {!isLegal && (
            <div className="hidden md:flex items-center gap-7 text-sm font-medium">
              {NAV_LINKS.map(({ label, to }) => (
                <a key={label} href={to}
                  className="text-slate-300 hover:text-white transition">
                  {label}
                </a>
              ))}
            </div>
          )}

          {/* Right: language switch + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitch compact mode="dark" />
            <Link to="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg font-semibold">
              {t("lp_nav_enter")}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-slate-300 hover:text-white transition"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3 space-y-1">
          {!isLegal && NAV_LINKS.map(({ label, to }) => (
            <a key={label} href={to} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-slate-300 hover:text-white font-medium">
              {label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-700 space-y-2">
            <div className="py-1">
              <LanguageSwitch mode="dark" />
            </div>
            <Link to="/login" onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-blue-400 font-semibold">
              {t("lp_nav_enter")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
