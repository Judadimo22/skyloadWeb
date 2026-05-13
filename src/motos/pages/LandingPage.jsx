import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Search, Bike, Shield, Zap, Star, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { MotoCard } from "../components/MotoCard";
import { apiGetListings, MOTO_TYPES, CITIES } from "../api/motosApi";

const STATS = [
  { label: "Motos publicadas", value: "500+" },
  { label: "Ciudades", value: "20+" },
  { label: "Ventas exitosas", value: "300+" },
  { label: "Vendedores activos", value: "150+" },
];

const HOW = [
  { icon: "📝", title: "Regístrate gratis", desc: "Crea tu cuenta en segundos y accede al panel de vendedor." },
  { icon: "🏍️", title: "Publica tu moto", desc: "Agrega fotos, precio y descripción. Elige plan básico o destacado." },
  { icon: "💬", title: "Conecta con compradores", desc: "Recibe mensajes directos por WhatsApp y cierra la venta." },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    apiGetListings({ plan: "destacada", limit: 6 })
      .then(data => setFeatured(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (city) params.set("city", city);
    navigate(`/motos/buscar?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-orange-500/30">
              <TrendingUp size={12} /> El mercado de motos #1 de Colombia
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Compra y vende<br />
              <span className="text-orange-500">motos usadas</span> con confianza
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Miles de compradores buscan su moto ideal todos los días. Publica la tuya en minutos y llega a ellos directo.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Marca, modelo o tipo..."
                  className="flex-1 text-gray-800 text-sm outline-none py-2 bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-l border-gray-100">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="flex-1 text-gray-700 text-sm outline-none bg-transparent py-2 pr-2">
                  <option value="">Todas las ciudades</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit"
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition flex-shrink-0">
                Buscar
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-orange-500 text-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-orange-100 text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Buscar por tipo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { type: "Deportiva", emoji: "🏎️" },
            { type: "Naked", emoji: "🏍️" },
            { type: "Scooter", emoji: "🛵" },
            { type: "Touring", emoji: "🗺️" },
            { type: "Enduro", emoji: "⛰️" },
            { type: "Custom", emoji: "✨" },
            { type: "Eléctrica", emoji: "⚡" },
          ].map(({ type, emoji }) => (
            <Link
              key={type}
              to={`/motos/buscar?type=${type}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:bg-orange-50 transition group shadow-sm"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition text-center">{type}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured listings ── */}
      {featured.length > 0 && (
        <section className="py-10 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-orange-500" fill="#f97316" />
                <h2 className="text-2xl font-extrabold text-gray-900">Motos destacadas</h2>
              </div>
              <Link to="/motos/buscar" className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
                Ver todas <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {featured.map(m => <MotoCard key={m._id} moto={m} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3">¿Cómo funciona?</h2>
        <p className="text-gray-500 text-center mb-10 text-sm">Vende tu moto en 3 simples pasos</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">{h.icon}</div>
              <div className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{h.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-12 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-3">¿Tienes una moto para vender?</h2>
          <p className="text-orange-100 mb-6">Publica gratis en minutos y llega a miles de compradores.</p>
          <Link
            to="/motos/panel/publicar"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-7 py-3 rounded-xl font-bold text-sm hover:bg-orange-50 transition shadow-lg"
          >
            <Bike size={16} /> Publicar mi moto gratis
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
