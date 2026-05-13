import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Pencil, Trash2, Eye, Star, Clock, CheckCircle, XCircle, Bike, CreditCard } from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { PaymentModal } from "../components/PaymentModal";
import { apiGetMyListings, apiDeleteListing, PLANS } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";
import Swal from "sweetalert2";

const STATE_CONFIG = {
  pending:  { label: "Pendiente",  color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: Clock },
  active:   { label: "Activa",     color: "bg-green-50 text-green-700 border-green-200",   icon: CheckCircle },
  rejected: { label: "Rechazada",  color: "bg-red-50 text-red-700 border-red-200",         icon: XCircle },
  sold:     { label: "Vendida",    color: "bg-gray-50 text-gray-500 border-gray-200",       icon: CheckCircle },
};

const fmt = (n) => n?.toLocaleString("es-CO") ?? "—";

export const MyListingsPage = () => {
  const navigate = useNavigate();
  const { motosUser } = useMotos();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payListing, setPayListing] = useState(null); // { _id, plan }

  useEffect(() => {
    if (!motosUser) { navigate("/motos/login"); return; }
    load();
  }, [motosUser]);

  const load = () => {
    setLoading(true);
    apiGetMyListings()
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (m) => {
    const result = await Swal.fire({
      title: "¿Eliminar anuncio?",
      text: `"${m.brand} ${m.model}" será eliminado permanentemente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      await apiDeleteListing(m._id);
      setListings(ls => ls.filter(l => l._id !== m._id));
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar", confirmButtonColor: "#f97316" });
    }
  };

  const handleMarkSold = async (m) => {
    const result = await Swal.fire({
      title: "¿Marcar como vendida?",
      text: "El anuncio se marcará como vendido y dejará de aparecer en búsquedas.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, marcar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f97316",
    });
    if (!result.isConfirmed) return;
    // Optimistic
    setListings(ls => ls.map(l => l._id === m._id ? { ...l, state: "sold" } : l));
    // TODO: call API when endpoint exists
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Mis anuncios</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {loading ? "Cargando..." : `${listings.length} anuncio${listings.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link
            to="/motos/panel/publicar"
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition shadow-sm"
          >
            <Plus size={16} /> Publicar moto
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
            <span className="text-6xl mb-4">🏍️</span>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Aún no tienes anuncios</h3>
            <p className="text-gray-400 text-sm mb-6">Publica tu primera moto gratis y llega a miles de compradores</p>
            <Link to="/motos/panel/publicar"
              className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition">
              <Plus size={16} /> Publicar mi moto
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(m => {
              const stateConf = STATE_CONFIG[m.state] || STATE_CONFIG.pending;
              const StateIcon = stateConf.icon;
              const photo = m.photos?.[0] || m.photo || null;

              return (
                <div key={m._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Photo */}
                    <div className="sm:w-32 h-32 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 relative">
                      {photo ? (
                        <img src={photo} alt={`${m.brand} ${m.model}`} className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🏍️</div>
                      )}
                      {m.plan === "destacada" && (
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <Star size={8} fill="white" /> TOP
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">
                            {m.brand} {m.model} {m.year}
                          </h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${stateConf.color}`}>
                            <StateIcon size={9} /> {stateConf.label}
                          </span>
                        </div>
                        <p className="text-orange-600 font-bold text-sm">${fmt(m.price)}</p>
                        <div className="flex gap-3 mt-1 text-xs text-gray-400">
                          <span>{m.city}</span>
                          {m.mileage != null && <span>{fmt(m.mileage)} km</span>}
                          <span>{m.type}</span>
                        </div>
                        {/* Plan badge */}
                        <div className="mt-2">
                          {m.plan === "destacada" ? (
                            <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <Star size={9} /> Plan Destacada
                            </span>
                          ) : (
                            <button
                              onClick={() => setPayListing(m)}
                              className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 font-semibold px-2 py-0.5 rounded-full hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition flex items-center gap-1 w-fit"
                            >
                              <CreditCard size={9} /> Mejorar a Destacada
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        <Link
                          to={`/motos/moto/${m._id}`}
                          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                          <Eye size={13} /> Ver
                        </Link>
                        <Link
                          to={`/motos/panel/editar/${m._id}`}
                          className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 rounded-xl text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Pencil size={13} /> Editar
                        </Link>
                        {m.state !== "sold" && (
                          <button
                            onClick={() => handleMarkSold(m)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-green-200 rounded-xl text-xs font-medium text-green-600 hover:bg-green-50 transition"
                          >
                            <CheckCircle size={13} /> Vendida
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(m)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 size={13} /> Borrar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* State message */}
                  {m.state === "pending" && (
                    <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-2 text-xs text-yellow-700 flex items-center gap-1.5">
                      <Clock size={11} /> Tu anuncio está pendiente de revisión. Se publicará en breve.
                    </div>
                  )}
                  {m.state === "rejected" && m.rejectedReason && (
                    <div className="bg-red-50 border-t border-red-100 px-4 py-2 text-xs text-red-700 flex items-center gap-1.5">
                      <XCircle size={11} /> Motivo: {m.rejectedReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment modal */}
      {payListing && (
        <PaymentModal
          listingId={payListing._id}
          currentPlan={payListing.plan}
          onClose={() => setPayListing(null)}
          onSuccess={(plan) => {
            setListings(ls => ls.map(l => l._id === payListing._id ? { ...l, plan } : l));
            setPayListing(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};
