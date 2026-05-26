import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  MapPin, Truck, Users, BarChart3, Shield,
  ChevronRight, Zap, CheckCircle2,
  HeadphonesIcon, ArrowRight
} from "lucide-react";
import { LandingNavBar } from "../Components/Landing/LandingNavBar";
import { LandingFooter } from "../Components/Landing/LandingFooter";
import { useLanguage } from "../context/LanguageContext";

export const SkyloadLandingPage = () => {
  const { t } = useLanguage();
  const location = useLocation();

  // Cuando venimos de una página legal con una sección destino, hacemos scroll tras el render
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const id = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => clearTimeout(id);
  }, [location.state]);

  const STATS = [
    { value: "500+", label: t("lp_stat_1") },
    { value: "20+",  label: t("lp_stat_2") },
    { value: "300+", label: t("lp_stat_3") },
    { value: "98%",  label: t("lp_stat_4") },
  ];

  const FLEET_FEATURES = [
    { icon: MapPin,    title: t("lp_f1_title"), desc: t("lp_f1_desc") },
    { icon: Truck,     title: t("lp_f2_title"), desc: t("lp_f2_desc") },
    { icon: Users,     title: t("lp_f3_title"), desc: t("lp_f3_desc") },
    { icon: BarChart3, title: t("lp_f4_title"), desc: t("lp_f4_desc") },
    { icon: Shield,    title: t("lp_f5_title"), desc: t("lp_f5_desc") },
    { icon: Zap,       title: t("lp_f6_title"), desc: t("lp_f6_desc") },
  ];

  const HOW_FLEET = [
    { step: "01", title: t("lp_step_1_title"), desc: t("lp_step_1_desc") },
    { step: "02", title: t("lp_step_2_title"), desc: t("lp_step_2_desc") },
    { step: "03", title: t("lp_step_3_title"), desc: t("lp_step_3_desc") },
  ];

  const PERKS = [
    { icon: HeadphonesIcon, text: t("lp_perk_1") },
    { icon: Shield,         text: t("lp_perk_2") },
    { icon: Zap,            text: t("lp_perk_3") },
  ];

  const BENEFITS = [t("lp_benefit_1"), t("lp_benefit_2"), t("lp_benefit_3")];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LandingNavBar />

      {/* ── Hero ── */}
      <section className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute -top-32 -right-32 w-125 h-125 bg-blue-600/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-blue-500/8 rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              {t("lp_hero_badge")}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              {t("lp_hero_title")}<br />
              <span className="text-blue-400">{t("lp_hero_title_accent")}</span>
            </h1>

            <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-xl">
              {t("lp_hero_desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/login"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition shadow-xl shadow-blue-600/25">
                {t("lp_hero_cta_primary")} <ArrowRight size={15} />
              </Link>
              <a href="#contacto"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition backdrop-blur-sm">
                {t("lp_hero_cta_secondary")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-blue-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-blue-100 text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quiénes somos ── */}
      <section className="py-20 bg-white" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              {t("lp_about_tag")}
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-5 leading-tight">
              {t("lp_about_title")}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">{t("lp_about_p1")}</p>
            <p className="text-gray-500 leading-relaxed">{t("lp_about_p2")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {BENEFITS.map(item => (
              <div key={item} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Características ── */}
      <section className="py-20 bg-gray-50" id="plataformas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              {t("lp_features_tag")}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{t("lp_features_title")}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-2xl">{t("lp_features_desc")}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLEET_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition hover:border-blue-200 group">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                  <Icon size={16} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_FLEET.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <span className="text-3xl font-extrabold text-blue-100 leading-none shrink-0">{step}</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/login"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/20">
              {t("lp_access_btn")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA + Contacto ── */}
      <section className="py-16 bg-linear-to-br from-slate-900 to-slate-800 text-white" id="contacto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* CTA text */}
            <div>
              <h2 className="text-3xl font-extrabold mb-4 leading-tight">{t("lp_cta_title")}</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">{t("lp_cta_desc")}</p>
              <div className="space-y-3">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-blue-600/20 border border-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-blue-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-slate-800 rounded-2xl p-7 border border-slate-700">
              <h3 className="font-bold text-lg mb-5">{t("lp_contact_title")}</h3>
              <div className="space-y-4 text-sm">

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{t("lp_contact_email_label")}</p>
                    <a href="mailto:info@fleetpoint360.co" className="hover:text-blue-400 transition">
                      info@fleetpoint360.co
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{t("lp_contact_phone_label")}</p>
                    <a href="https://wa.me/573100000000" target="_blank" rel="noreferrer"
                      className="hover:text-blue-400 transition">
                      +57 310 000 0000
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{t("lp_contact_location_label")}</p>
                    <span>{t("lp_contact_location_value")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-700">
                <Link to="/login"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition">
                  {t("lp_contact_cta")} <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};
