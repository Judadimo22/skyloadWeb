import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bike, Plus, ListChecks, Star, Clock, CheckCircle, XCircle,
  TrendingUp, Eye, CreditCard, LogOut, Shield, ChevronRight
} from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { apiGetMyListings } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";

const fmt = (n) => n?.toLocaleString("es-CO") ?? "—";

const STATE_CONFIG = {
  pending:  { label: "Pendiente",  color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  active:   { label: "Activa",     color: "text-green-600 bg-green-50 border-green-200",    icon: CheckCircle },
  rejected: { label: "Rechazada",  color: "text-red-500 bg-red-50 border-red-200",          icon: XCircle },
  sold:     { label: "Vendida",    color: "text-gray-500 bg-gray-50 border-gray-200",        icon: CheckCircle },
};

export const UserPanel = () => {
  const navigate = useNavigate();
  const { motosUser, motosLogout, isMotosAdmin } = useMotos();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!motosUser) { navigate("/motos/login"); return; }
    apiGetMyListings()
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [motosUser, navigate]);

  const handleLogout = () => { motosLogout(); navigate("/motos"); };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.state === "active").length,
    pending: listings.filter(l => l.state === "pending").length,
    featured: listings.filter(l => l.plan === "destacada").length,
  };

  const recent = listings.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Welcome header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Hola, {motosUser?.name?.split(" ")[0] || "vendedor"} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Panel de vendedor · MotoMarket</p>
          </div>
          <Link
            to="/motos/panel/publicar"
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition shadow-sm"
          >
            <Plus size={16} /> Publicar moto
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: stats + quick actions ── */}
          <div className="space-y-5">

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total", value: stats.total, color: "from-gray-700 to-gray-800", icon: ListChecks },
                { label: "Activas", value: stats.active, color: "from-green-500 to-green-600", icon: CheckCircle },
                { label: "Pendientes", value: stats.pending, color: "from-yellow-400 to-yellow-500", icon: Clock },
                { label: "Destacadas", value: stats.featured, color: "from-orange-500 to-orange-600", icon: Star },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} text-white rounded-2xl p-4 shadow-sm`}>
                  <s.icon size={16} className="opacity-70 mb-1" />
                  <p className="text-2xl font-extrabold">{loading ? "—" : s.value}</p>
                  <p className="text-xs opacity-80">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Acciones rápidas</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { to: "/motos/panel/publicar", icon: Plus, label: "Publicar nueva moto", color: "text-orange-500" },
                  { to: "/motos/panel/mis-motos", icon: ListChecks, label: "Ver mis anuncios", color: "text-blue-500" },
                  { to: "/motos/buscar", icon: Eye, label: "Ver búsqueda pública", color: "text-gray-500" },
                  ...(isMotosAdmin ? [{ to: "/motos/admin", icon: Shield, label: "Panel de administración", color: "text-purple-500" }] : []),
                ].map(item => (
                  <Link key={item.to} to={item.to}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition group">
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className={item.color} />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-400 transition" />
                  </Link>
                ))}
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition text-left group">
                  <LogOut size={16} className="text-red-400" />
                  <span className="text-sm font-medium text-red-500">Cerrar sesión</span>
                </button>
              </div>
            </div>

            {/* Account info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Mi cuenta</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {motosUser?.name?.[0]?.toUpperCase() || "V"}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{motosUser?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{motosUser?.email}</p>
                </div>
              </div>
              {isMotosAdmin && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 border border-purple-100 rounded-lg px-3 py-1.5">
                  <Shield size={11} /> Administrador
                </div>
              )}
            </div>
          </div>

          {/* ── Right: recent listings ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h2 className="font-bold text-gray-800">Mis anuncios recientes</h2>
                <Link to="/motos/panel/mis-motos"
                  className="text-xs text-orange-600 font-semibold hover:text-orange-700 transition flex items-center gap-1">
                  Ver todos <ChevronRight size={12} />
                </Link>
              </div>

              {loading ? (
                <div className="p-5 space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                  <span className="text-5xl mb-3">🏍️</span>
                  <h3 className="font-bold text-gray-700 mb-1">Aún no tienes anuncios</h3>
                  <p className="text-sm text-gray-400 mb-5">Publica tu primera moto y llega a miles de compradores</p>
                  <Link to="/motos/panel/publicar"
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition">
                    <Plus size={15} /> Publicar moto gratis
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recent.map(m => {
                    const conf = STATE_CONFIG[m.state] || STATE_CONFIG.pending;
                    const StateIcon = conf.icon;
                    const photo = m.photos?.[0] || m.photo || null;
                    return (
                      <div key={m._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                        {/* Thumb */}
                        <div className="w-16 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {photo
                            ? <img src={photo} alt="" className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = "none"; }} />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">🏍️</div>}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{m.brand} {m.model} {m.year}</p>
                          <p className="text-orange-600 font-semibold text-xs">${fmt(m.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${conf.color}`}>
                              <StateIcon size={8} /> {conf.label}
                            </span>
                            {m.plan === "destacada" && (
                              <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-200 font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Star size={8} /> Top
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Quick actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Link to={`/motos/moto/${m._id}`}
                            className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/motos/panel/editar/${m._id}`}
                            className="p-2 rounded-xl border border-blue-100 text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition">
                            <TrendingUp size={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {listings.length > 3 && (
                    <div className="px-5 py-3 text-center">
                      <Link to="/motos/panel/mis-motos"
                        className="text-sm text-orange-600 font-semibold hover:text-orange-700 transition">
                        Ver {listings.length - 3} más →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star size={16} fill="white" />
                <h3 className="font-bold">Destaca tu anuncio</h3>
              </div>
              <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                Los anuncios destacados aparecen primero en las búsquedas y tienen badge especial. ¡Vende más rápido!
              </p>
              <Link to="/motos/panel/mis-motos"
                className="inline-flex items-center gap-1.5 bg-white text-orange-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-50 transition">
                <CreditCard size={14} /> Mejorar mis anuncios
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
