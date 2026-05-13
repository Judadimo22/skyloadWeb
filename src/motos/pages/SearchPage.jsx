import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, MapPin, SlidersHorizontal, X, ChevronDown, Star } from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { MotoCard } from "../components/MotoCard";
import { apiGetListings, MOTO_TYPES, MOTO_BRANDS, CITIES } from "../api/motosApi";

const PRICE_RANGES = [
  { label: "Cualquier precio", min: "", max: "" },
  { label: "Hasta $3.000.000", min: "", max: 3000000 },
  { label: "$3M – $7M", min: 3000000, max: 7000000 },
  { label: "$7M – $15M", min: 7000000, max: 15000000 },
  { label: "$15M – $30M", min: 15000000, max: 30000000 },
  { label: "Más de $30M", min: 30000000, max: "" },
];

const YEAR_MIN = 2000;
const YEAR_MAX = new Date().getFullYear();

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filters from URL
  const q = searchParams.get("q") || "";
  const city = searchParams.get("city") || "";
  const type = searchParams.get("type") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minYear = searchParams.get("minYear") || "";
  const maxYear = searchParams.get("maxYear") || "";
  const sortBy = searchParams.get("sort") || "recent";

  // Local filter state (for sidebar)
  const [localQ, setLocalQ] = useState(q);
  const [localCity, setLocalCity] = useState(city);
  const [localType, setLocalType] = useState(type);
  const [localBrand, setLocalBrand] = useState(brand);
  const [localPrice, setLocalPrice] = useState("");
  const [localMinYear, setLocalMinYear] = useState(minYear);
  const [localMaxYear, setLocalMaxYear] = useState(maxYear);
  const [localSort, setLocalSort] = useState(sortBy);

  const LIMIT = 12;

  const fetchMotos = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: LIMIT, skip: (page - 1) * LIMIT };
      if (q) params.q = q;
      if (city) params.city = city;
      if (type) params.type = type;
      if (brand) params.brand = brand;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minYear) params.minYear = minYear;
      if (maxYear) params.maxYear = maxYear;
      if (sortBy) params.sort = sortBy;

      const data = await apiGetListings(params);
      if (Array.isArray(data)) {
        setMotos(data);
        setTotal(data.length < LIMIT ? (page - 1) * LIMIT + data.length : (page - 1) * LIMIT + data.length + 1);
      } else if (data.listings) {
        setMotos(data.listings);
        setTotal(data.total || 0);
      } else {
        setMotos([]);
        setTotal(0);
      }
    } catch {
      setMotos([]);
    } finally {
      setLoading(false);
    }
  }, [q, city, type, brand, minPrice, maxPrice, minYear, maxYear, sortBy, page]);

  useEffect(() => { fetchMotos(); }, [fetchMotos]);

  // Sync local state when URL changes
  useEffect(() => {
    setLocalQ(searchParams.get("q") || "");
    setLocalCity(searchParams.get("city") || "");
    setLocalType(searchParams.get("type") || "");
    setLocalBrand(searchParams.get("brand") || "");
    setLocalMinYear(searchParams.get("minYear") || "");
    setLocalMaxYear(searchParams.get("maxYear") || "");
    setLocalSort(searchParams.get("sort") || "recent");
    setPage(1);
  }, [searchParams]);

  const applyFilters = () => {
    const p = new URLSearchParams();
    if (localQ) p.set("q", localQ);
    if (localCity) p.set("city", localCity);
    if (localType) p.set("type", localType);
    if (localBrand) p.set("brand", localBrand);
    if (localSort && localSort !== "recent") p.set("sort", localSort);
    if (localMinYear) p.set("minYear", localMinYear);
    if (localMaxYear) p.set("maxYear", localMaxYear);

    const priceRange = PRICE_RANGES.find(r => String(r.min) + "-" + String(r.max) === localPrice);
    if (priceRange) {
      if (priceRange.min !== "") p.set("minPrice", priceRange.min);
      if (priceRange.max !== "") p.set("maxPrice", priceRange.max);
    }

    setSearchParams(p);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setLocalQ(""); setLocalCity(""); setLocalType(""); setLocalBrand("");
    setLocalPrice(""); setLocalMinYear(""); setLocalMaxYear(""); setLocalSort("recent");
    setSearchParams({});
  };

  const activeFiltersCount = [q, city, type, brand, minPrice, maxPrice, minYear, maxYear].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Buscar</label>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-orange-400 bg-white">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={localQ} onChange={e => setLocalQ(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyFilters()}
            placeholder="Marca, modelo..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Ciudad</label>
        <select value={localCity} onChange={e => setLocalCity(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Todas las ciudades</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tipo</label>
        <div className="flex flex-wrap gap-1.5">
          {["", ...MOTO_TYPES].map(t => (
            <button key={t || "all"} onClick={() => setLocalType(t)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition ${
                localType === t ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"
              }`}>
              {t || "Todos"}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Marca</label>
        <select value={localBrand} onChange={e => setLocalBrand(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          <option value="">Todas las marcas</option>
          {MOTO_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Precio</label>
        <select value={localPrice} onChange={e => setLocalPrice(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white">
          {PRICE_RANGES.map(r => (
            <option key={r.label} value={r.min !== "" || r.max !== "" ? `${r.min}-${r.max}` : ""}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Year range */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Año</label>
        <div className="flex gap-2 items-center">
          <input type="number" value={localMinYear} onChange={e => setLocalMinYear(e.target.value)}
            placeholder={String(YEAR_MIN)} min={YEAR_MIN} max={YEAR_MAX}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" />
          <span className="text-gray-400 text-xs">–</span>
          <input type="number" value={localMaxYear} onChange={e => setLocalMaxYear(e.target.value)}
            placeholder={String(YEAR_MAX)} min={YEAR_MIN} max={YEAR_MAX}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button onClick={clearFilters}
          className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition font-medium">
          Limpiar
        </button>
        <button onClick={applyFilters}
          className="flex-1 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition">
          Aplicar
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setShowFilters(o => !o)}
              className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <SlidersHorizontal size={15} />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <p className="text-sm text-gray-500">
              {loading ? "Buscando..." : <><span className="font-bold text-gray-800">{motos.length}</span> motos encontradas</>}
              {q && <> para <span className="font-semibold text-orange-600">"{q}"</span></>}
              {city && <> en <span className="font-semibold">{city}</span></>}
            </p>
          </div>
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium whitespace-nowrap">Ordenar:</label>
            <select value={localSort} onChange={e => { setLocalSort(e.target.value); const p = new URLSearchParams(searchParams); p.set("sort", e.target.value); setSearchParams(p); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="recent">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
              <option value="featured">Destacadas primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFiltersCount > 0 && (
        <div className="bg-white border-b border-gray-100 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium">Filtros:</span>
            {[
              q && { label: `"${q}"`, key: "q" },
              city && { label: city, key: "city" },
              type && { label: type, key: "type" },
              brand && { label: brand, key: "brand" },
              (minPrice || maxPrice) && { label: "Precio", key: "price" },
              (minYear || maxYear) && { label: `${minYear || ""}–${maxYear || ""}`, key: "year" },
            ].filter(Boolean).map(chip => (
              <button key={chip.key} onClick={() => {
                const p = new URLSearchParams(searchParams);
                if (chip.key === "price") { p.delete("minPrice"); p.delete("maxPrice"); }
                else if (chip.key === "year") { p.delete("minYear"); p.delete("maxYear"); }
                else p.delete(chip.key);
                setSearchParams(p);
              }}
                className="flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full border border-orange-200 hover:bg-orange-100 transition">
                {chip.label} <X size={11} />
              </button>
            ))}
            <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-red-500 transition font-medium">
              Limpiar todo
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 text-sm">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    <X size={11} /> Limpiar
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-800">Filtros</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : motos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-4">🏍️</span>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No encontramos motos</h3>
                <p className="text-gray-400 text-sm mb-6">Intenta con otros filtros o términos de búsqueda</p>
                <button onClick={clearFilters}
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition">
                  Ver todas las motos
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {motos.map(m => <MotoCard key={m._id} moto={m} />)}
                </div>
                {/* Pagination */}
                {motos.length === LIMIT && (
                  <div className="flex justify-center mt-10 gap-3">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition">
                      ← Anterior
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500 font-medium">Página {page}</span>
                    <button onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
