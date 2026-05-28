import { Link } from "react-router";
import { Logo } from "../Logo/Logo";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const LandingFooter = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-14 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
                <Logo w={28} h={28} />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Fleet Point <span className="text-blue-400 font-normal">360</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("lp_footer_desc")}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="LinkedIn"
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Linkedin size={14} />
              </a>
              <a href="#" aria-label="Instagram"
                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("lp_footer_company_col")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#servicios"   className="hover:text-blue-400 transition">{t("lp_nav_services")}</a></li>
              <li><a href="/#plataformas" className="hover:text-blue-400 transition">{t("lp_nav_features")}</a></li>
              <li><a href="/#contacto"    className="hover:text-blue-400 transition">{t("lp_nav_contact")}</a></li>
              <li><Link to="/terminos"    className="hover:text-blue-400 transition">{t("lp_footer_terms")}</Link></li>
              <li><Link to="/privacidad"  className="hover:text-blue-400 transition">{t("lp_footer_privacy")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t("lp_footer_contact_col")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={13} className="text-blue-400 shrink-0" />
                info@fleetpoint360.com
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={13} className="text-blue-400 shrink-0" />
                +57 310 000 0000
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={13} className="text-blue-400 shrink-0" />
                Colombia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© {year} Fleet Point 360. {t("lp_footer_rights")}</span>
          <div className="flex items-center gap-4">
            <Link to="/terminos"   className="hover:text-slate-400 transition">{t("lp_footer_terms")}</Link>
            <Link to="/privacidad" className="hover:text-slate-400 transition">{t("lp_footer_privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
