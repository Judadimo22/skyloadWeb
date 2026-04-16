import { useLanguage } from "../context/LanguageContext";

export const LanguageSwitch = ({ mode = "dark" }) => {
  const { lang, toggleLang } = useLanguage();
  const isEN = lang === "en";
  const isDark = mode === "dark";

  return (
    <button
      onClick={toggleLang}
      title={isEN ? "Cambiar a Español" : "Switch to English"}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all ${
        isDark
          ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
      }`}
    >
      {/* Toggle track */}
      <div className="relative w-9 h-5 flex-shrink-0">
        <div className={`absolute inset-0 rounded-full transition-colors duration-200 ${isEN ? "bg-blue-600" : "bg-green-600"}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isEN ? "translate-x-0" : "translate-x-4"}`} />
      </div>

      {/* Labels */}
      <div className="flex items-center gap-1 text-xs font-semibold">
        <span className={isEN ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-slate-500" : "text-gray-400")}>EN</span>
        <span className={isDark ? "text-slate-600" : "text-gray-300"}>/</span>
        <span className={!isEN ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-slate-500" : "text-gray-400")}>ES</span>
      </div>
    </button>
  );
};
