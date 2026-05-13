import { Link } from "react-router";
import { Bike, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Bike size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">Moto<span className="text-orange-500">Market</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              {t("mm_footer_desc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t("mm_footer_nav")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/motos" className="hover:text-orange-400 transition">{t("mm_footer_home")}</Link></li>
              <li><Link to="/motos/buscar" className="hover:text-orange-400 transition">{t("mm_footer_browse")}</Link></li>
              <li><Link to="/motos/panel/publicar" className="hover:text-orange-400 transition">{t("mm_footer_post")}</Link></li>
              <li><Link to="/motos/login" className="hover:text-orange-400 transition">{t("mm_footer_login")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{t("mm_footer_contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={13} /> info@motomarket.co</li>
              <li className="flex items-center gap-2"><Phone size={13} /> +57 310 000 0000</li>
              <li className="flex items-center gap-2"><MapPin size={13} /> Colombia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} MotoMarket — {t("mm_footer_rights")}
        </div>
      </div>
    </footer>
  );
};
