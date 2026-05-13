import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Shield, CheckCircle, XCircle, Trash2, Eye, Clock,
  Star, Search, Filter, RefreshCw, MapPin
} from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { apiAdminGetListings, apiAdminApprove, apiAdminReject, apiAdminDelete } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";
import Swal from "sweetalert2";

const fmt = (n) => n?.toLocaleString("es-CO") ?? "—";

const STATE_CONFIG = {
  pending:  { label: "Pendiente",  badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  active:   { label: "Activa",     badge: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Rechazada",  badge: "bg-red-50 text-red-600 border-red-200" },
  sold:     { label: "Vendida",    badge: "bg-gray-50 text-gray-500 border-gray-200" },
};

export const AdminPage = () => {
  const navigate = useNavigate();
  const { motosUser, isMotosAdmin } = useMotos();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!motosUser) { navigate("/motos/login"); return; }
    if (!isMotosAdmin) { navigate("/motos/panel"); return; }
    load();
  }, [motosUser, isMotosAdmin, navigate]);

  const load = () => {
    setLoading(true);
    apiAdminGetListings()
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (m) => {
    setActionLoading(m._id + "_approve");
    try {
      const res = await apiAdminApprove(m._id);
      if (res._id || res.ok) {
        setListings(ls => ls.map(l => l._id === m._id ? { ...l, state: "active" } : l));
        Swal.fire({ icon: "success", title: "Aprobado", text: `${m.brand} ${m.model} fue aprobado.`, timer: 1800, showConfirmButton: false, confirmButtonColor: "#f97316" });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: res.message || "No se pudo aprobar", confirmButtonColor: "#f97316" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Error de conexión", confirmButtonColor: "#f97316" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (m) => {
    const { value: reason } = await Swal.fire({
      title: "Rechazar anuncio",
      text: `¿Por qué rechazas "${m.brand} ${m.model}"?`,
      input: "textarea",
      inputPlaceholder: "Motivo del rechazo (opcional)...",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (reason === undefined) return; // cancelled

    setActionLoading(m._id + "_reject");
    try {
      const res = await apiAdminReject(m._id, { reason });
      if (res._id || res.ok) {
        setListings(ls => ls.map(l => l._id === m._id ? { ...l, state: "rejected", rejectedReason: reason } : l));
        Swal.fire({ icon: "success", title: "Rechazado", timer: 1800, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: res.message || "No se pudo rechazar", confirmButtonColor: "#f97316" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Error de conexión", confirmButtonColor: "#f97316" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (m) => {
    const result = await Swal.fire({
      title: "¿Eliminar definitivamente?",
      text: `"${m.brand} ${m.model}" será eliminado para siempre.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
    });
    if (!result.isConfirmed) return;

    setActionLoading(m._id + "_delete");
    try {
      await apiAdminDelete(m._id);
      setListings(ls => ls.filter(l => l._id !== m._id));
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar", confirmButtonColor: "#f97316" });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter + search
  const filtered = listings.filter(m => {
    if (filter !== "all" && m.state !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.brand?.toLowerCase().includes(q) ||
        m.model?.toLowerCase().includes(q) ||
        m.city?.toLowerCase().includes(q) ||
        m.user?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: listings.length,
    pending: listings.filter(l => l.state === "pending").length,
    active: listings.filter(l => l.state === "active").length,
    rejected: listings.filter(l => l.state === "rejected").length,
  };

  const TABS = [
    { key: "pending", label: "Pendientes", count: counts.pending, color: "text-yellow-600" },
    { key: "active",  label: "Activos",    count: counts.active,  color: "text-green-600" },
    { key: "rejected",label: "Rechazados", count: counts.rejected,color: "text-red-500" },
    { key: "all",     label: "Todos",      count: counts.all,     color: "text-gray-600" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Shield size={20} className="text-orange-400" />
            <h1 className="text-xl font-extrabold">Panel de Administración</h1>
          </div>
          <p className="text-gray-400 text-sm">Gestiona y modera los anuncios de la plataforma</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total anuncios", value: counts.all, color: "bg-gray-800 text-white" },
            { label: "Pendientes", value: counts.pending, color: "bg-yellow-500 text-white" },
            { label: "Activos", value: counts.active, color: "bg-green-500 text-white" },
            { label: "Rechazados", value: counts.rejected, color: "bg-red-500 text-white" },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 shadow-sm`}>
              <p className="text-2xl font-extrabold">{loading ? "—" : s.value}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters row */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  filter === tab.key
                    ? `border-orange-500 ${tab.color}`
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}>
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    filter === tab.key ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
            <div className="ml-auto p-2 flex items-center">
              <button onClick={load} className="p-2 text-gray-400 hover:text-orange-500 transition rounded-lg hover:bg-orange-50">
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por marca, ciudad o vendedor..."
                className="flex-1 text-sm outline-none bg-transparent" />
            </div>
          </div>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
            <span className="text-5xl mb-3">📋</span>
            <h3 className="font-bold text-gray-700 mb-1">Sin anuncios</h3>
            <p className="text-sm text-gray-400">
              {filter === "pending" ? "No hay anuncios pendientes de revisión." : "No se encontraron anuncios con este filtro."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(m => {
              const conf = STATE_CONFIG[m.state] || STATE_CONFIG.pending;
              const photo = m.photos?.[0] || m.photo || null;
              const isAL = (suffix) => actionLoading === m._id + "_" + suffix;

              return (
                <div key={m._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Photo */}
                    <div className="sm:w-28 h-24 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 relative">
                      {photo
                        ? <img src={photo} alt="" className="w-full h-full object-cover"
                            onError={e => { e.target.style.display = "none"; }} />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🏍️</div>}
                      {m.plan === "destacada" && (
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Star size={8} fill="white" /> TOP
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 text-sm">{m.brand} {m.model} {m.year}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conf.badge}`}>
                            {conf.label}
                          </span>
                        </div>
                        <p className="text-orange-600 font-bold text-sm mb-1">${fmt(m.price)}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                          {m.city && <span className="flex items-center gap-0.5"><MapPin size={10} />{m.city}</span>}
                          <span>{m.type}</span>
                          {m.mileage != null && <span>{fmt(m.mileage)} km</span>}
                        </div>
                        {m.user && (
                          <p className="text-xs text-gray-400 mt-1">
                            Vendedor: <span className="font-semibold text-gray-600">{m.user.name}</span>
                            {m.user.email && <span className="ml-1 text-gray-400">· {m.user.email}</span>}
                          </p>
                        )}
                        {m.rejectedReason && (
                          <p className="text-xs text-red-500 mt-1">Motivo: {m.rejectedReason}</p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <Link to={`/motos/moto/${m._id}`} target="_blank"
                          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50 transition">
                          <Eye size={13} /> Ver
                        </Link>

                        {m.state !== "active" && (
                          <button onClick={() => handleApprove(m)} disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-2 border border-green-200 bg-green-50 rounded-xl text-xs font-bold text-green-600 hover:bg-green-100 transition disabled:opacity-50">
                            {isAL("approve")
                              ? <span className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                              : <CheckCircle size={13} />}
                            Aprobar
                          </button>
                        )}

                        {m.state !== "rejected" && (
                          <button onClick={() => handleReject(m)} disabled={!!actionLoading}
                            className="flex items-center gap-1.5 px-3 py-2 border border-orange-200 bg-orange-50 rounded-xl text-xs font-bold text-orange-600 hover:bg-orange-100 transition disabled:opacity-50">
                            {isAL("reject")
                              ? <span className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                              : <XCircle size={13} />}
                            Rechazar
                          </button>
                        )}

                        <button onClick={() => handleDelete(m)} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-3 py-2 border border-red-200 bg-red-50 rounded-xl text-xs font-bold text-red-500 hover:bg-red-100 transition disabled:opacity-50">
                          {isAL("delete")
                            ? <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            : <Trash2 size={13} />}
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
