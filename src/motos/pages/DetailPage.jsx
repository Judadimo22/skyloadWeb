import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  MapPin, Calendar, Gauge, Phone, ChevronLeft, Star, Share2,
  CheckCircle, Bike, MessageCircle, Shield, Eye
} from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { apiGetListing } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";

const fmt = (n) => n?.toLocaleString("es-CO") ?? "—";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-none">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || "—"}</span>
  </div>
);

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { motosUser } = useMotos();
  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiGetListing(id)
      .then(data => {
        if (data?._id) setMoto(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleWhatsApp = () => {
    if (!moto?.whatsapp && !moto?.phone) return;
    const phone = (moto.whatsapp || moto.phone || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Hola, vi tu moto ${moto.brand} ${moto.model} ${moto.year} en MotoMarket y me interesa. ¿Sigue disponible?`
    );
    window.open(`https://wa.me/57${phone}?text=${text}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: moto ? `${moto.brand} ${moto.model}` : "MotoMarket", url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  const photos = moto?.photos?.length ? moto.photos : moto?.photo ? [moto.photo] : [];
  const isOwner = motosUser && moto?.user?._id === motosUser._id;

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Cargando anuncio...</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error || !moto) return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
        <span className="text-6xl">😕</span>
        <h2 className="text-xl font-bold text-gray-700">Anuncio no encontrado</h2>
        <p className="text-gray-400 text-sm">Este anuncio no existe o fue eliminado.</p>
        <Link to="/motos/buscar"
          className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition">
          Ver otras motos
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-400">
          <Link to="/motos" className="hover:text-orange-500 transition">Inicio</Link>
          <span>/</span>
          <Link to="/motos/buscar" className="hover:text-orange-500 transition">Motos</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{moto.brand} {moto.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left col: photos + details ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Photo gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <div className="h-64 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {photos.length > 0 ? (
                    <img
                      src={photos[photoIdx]}
                      alt={`${moto.brand} ${moto.model}`}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">🏍️</div>
                  )}

                  {/* Sold overlay */}
                  {moto.state === "sold" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white font-bold text-xl px-6 py-2 rounded-full">VENDIDA</span>
                    </div>
                  )}

                  {/* Featured badge */}
                  {moto.plan === "destacada" && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      <Star size={11} fill="white" /> DESTACADA
                    </div>
                  )}

                  {/* Photo counter */}
                  {photos.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {photoIdx + 1} / {photos.length}
                    </div>
                  )}

                  {/* Arrows */}
                  {photos.length > 1 && (
                    <>
                      <button onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition">
                        ‹
                      </button>
                      <button onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/60 transition">
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {photos.map((p, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${i === photoIdx ? "border-orange-500" : "border-transparent"}`}>
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Title + price (mobile) */}
            <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">{moto.brand} {moto.model} {moto.year}</h1>
              <p className="text-2xl font-extrabold text-orange-600 mb-3">${fmt(moto.price)}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {moto.city}</span>
                {moto.mileage != null && <span className="flex items-center gap-1"><Gauge size={12} /> {fmt(moto.mileage)} km</span>}
                <span className="flex items-center gap-1"><Calendar size={12} /> {moto.year}</span>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-bold text-gray-800 mb-4">Especificaciones</h2>
              <div className="divide-y divide-gray-50">
                <InfoRow label="Marca" value={moto.brand} />
                <InfoRow label="Modelo" value={moto.model} />
                <InfoRow label="Año" value={moto.year} />
                <InfoRow label="Tipo" value={moto.type} />
                <InfoRow label="Motor" value={moto.engine} />
                {moto.mileage != null && <InfoRow label="Kilometraje" value={`${fmt(moto.mileage)} km`} />}
                <InfoRow label="Ciudad" value={moto.city} />
                {moto.color && <InfoRow label="Color" value={moto.color} />}
                {moto.plate && <InfoRow label="Placa" value={moto.plate} />}
                {moto.soat && <InfoRow label="SOAT vigente hasta" value={moto.soat} />}
                {moto.technomechanics && <InfoRow label="Tecnomecánica" value={moto.technomechanics} />}
              </div>
            </div>

            {/* Description */}
            {moto.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="font-bold text-gray-800 mb-3">Descripción</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{moto.description}</p>
              </div>
            )}
          </div>

          {/* ── Right col: contact card ── */}
          <div className="space-y-4">

            {/* Price + title (desktop) */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{moto.brand} {moto.model} {moto.year}</h1>
                <button onClick={handleShare} className="text-gray-400 hover:text-orange-500 transition flex-shrink-0">
                  <Share2 size={18} />
                </button>
              </div>
              <p className="text-3xl font-extrabold text-orange-600 mb-3">${fmt(moto.price)}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><MapPin size={12} /> {moto.city}</span>
                {moto.mileage != null && <span className="flex items-center gap-1"><Gauge size={12} /> {fmt(moto.mileage)} km</span>}
                <span className="flex items-center gap-1"><Calendar size={12} /> {moto.year}</span>
              </div>
              {moto.type && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {moto.type}
                </span>
              )}
            </div>

            {/* Contact card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {moto.user?.name?.[0]?.toUpperCase() || "V"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{moto.user?.name || "Vendedor"}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <CheckCircle size={10} className="text-green-500" /> Vendedor verificado
                  </p>
                </div>
              </div>

              {moto.state !== "sold" ? (
                <>
                  <button
                    onClick={handleWhatsApp}
                    disabled={!moto.whatsapp && !moto.phone}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3 shadow-sm"
                  >
                    <MessageCircle size={16} />
                    Contactar por WhatsApp
                  </button>
                  {moto.phone && (
                    <a href={`tel:${moto.phone}`}
                      className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition">
                      <Phone size={15} /> {moto.phone}
                    </a>
                  )}
                </>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl font-bold text-sm border border-red-100">
                  Esta moto ya fue vendida
                </div>
              )}
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                <p className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide">Tu anuncio</p>
                <div className="flex gap-2">
                  <Link to={`/motos/panel/editar/${moto._id}`}
                    className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                    Editar
                  </Link>
                  <Link to="/motos/panel"
                    className="flex-1 text-center py-2 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
                    Mi panel
                  </Link>
                </div>
              </div>
            )}

            {/* Safety tips */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-orange-500" />
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Consejos de seguridad</p>
              </div>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Verifica el estado del vehículo en persona antes de pagar</li>
                <li>• No hagas pagos anticipados sin ver la moto</li>
                <li>• Revisa el SOAT y tecnomecánica</li>
                <li>• Verifica la tarjeta de propiedad y que no tenga reportes</li>
              </ul>
            </div>

            {/* Share (mobile) */}
            <button onClick={handleShare}
              className="lg:hidden w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              <Share2 size={15} /> Compartir anuncio
            </button>

            <Link to="/motos/buscar"
              className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-semibold">
              <ChevronLeft size={15} /> Ver más motos
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
