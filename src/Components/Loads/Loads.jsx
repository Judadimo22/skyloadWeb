import { useEffect, useRef, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { Link, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const copyTrackLink = (userId, t) => {
  const url = `${window.location.origin}/track/${userId}`;
  navigator.clipboard.writeText(url).then(() => {
    Swal.fire({
      icon: "success",
      title: t("link_copied_title"),
      text: t("link_copied_text"),
      confirmButtonColor: "#2563eb",
      timer: 2500,
      showConfirmButton: false,
    });
  });
};

const DEFAULT_CENTER = { lat: 39.5, lng: -98.35 };
const DEFAULT_ZOOM = 4;

const MAP_STYLES = [
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#e8f5e9" }] },
  { featureType: "transit.station", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "transit.line", elementType: "all", stylers: [{ visibility: "off" }] },
];

const MAP_OPTIONS = {
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  zoomControl: true,
  styles: MAP_STYLES,
};

const STATUS_KEYS = ["all", "active", "picked_up", "on_the_way", "delivered", "completed"];

const STATUS_COLORS = {
  active: "bg-blue-100 text-blue-700 border-blue-200",
  picked_up: "bg-purple-100 text-purple-700 border-purple-200",
  on_the_way: "bg-amber-100 text-amber-700 border-amber-200",
  delivered: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// Convert km/h to mph
const toMph = (speed) => Math.round(speed * 0.621371);

export const Loads = () => {
  const { t } = useLanguage();

  const STATUS_LABELS = {
    all:       t("loads_status_all"),
    active:    t("loads_status_active"),
    picked_up: t("loads_status_picked_up"),
    on_the_way: t("loads_status_on_the_way"),
    delivered: t("loads_status_delivered"),
  };

  const [loads, setLoads] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [unitSearch, setUnitSearch] = useState("");
  const mapRef = useRef(null);
  const hasFitOnce = useRef(false);
  const [editLoad, setEditLoad] = useState(null);
  const [etaMap, setEtaMap] = useState({});
  const etaLastCalc = useRef({});

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    getLoads();
    getDrivers();
    const interval = setInterval(() => {
      getLoads();
      getDrivers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLoads = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/loads`);
      const data = await res.json();
      setLoads(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDrivers = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/users`);
      const data = await res.json();
      setAllUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  // All drivers view: every driver shown with their latest matching load (or null)
  const allDriversView = (() => {
    return allUsers
      .map(user => {
        // Find the latest non-completed load for this driver that matches the filter
        const userLoads = loads
          .filter(l => {
            if (l.user?._id !== user._id) return false;
            if (filter === "all" && l.state === "completed") return false;
            if (filter !== "all" && l.state !== filter) return false;
            return true;
          })
          .sort((a, b) => (b._id > a._id ? 1 : -1));
        return { user, load: userLoads[0] || null };
      })
      .filter(({ user, load }) => {
        const matchesUnit =
          unitSearch === "" ||
          user.unitNumber?.toString().toLowerCase().includes(unitSearch.toLowerCase());
        if (!matchesUnit) return false;
        // When a specific status filter is active, only show drivers with a matching load
        if (filter !== "all" && !load) return false;
        return true;
      })
      .sort((a, b) => {
        const ua = (a.user?.unitNumber || "").toString();
        const ub = (b.user?.unitNumber || "").toString();
        return ua.localeCompare(ub, undefined, { numeric: true });
      });
  })();

  // All users with known location — always shown on map
  const usersWithLocation = allUsers.filter(
    u => u.lat != null && u.lon != null
  );

  const fitAll = (map, items) => {
    if (!map || items.length === 0) return;
    if (items.length === 1) {
      map.setCenter({ lat: Number(items[0].lat), lng: Number(items[0].lon) });
      map.setZoom(14);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    items.forEach(u => bounds.extend({ lat: Number(u.lat), lng: Number(u.lon) }));
    map.fitBounds(bounds, 80);
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  // Fit all drivers when nothing selected
  useEffect(() => {
    if (!mapRef.current || selectedId) return;
    if (usersWithLocation.length > 0) {
      fitAll(mapRef.current, usersWithLocation);
    }
  }, [loads, allUsers, filter, selectedId]);

  // Follow selected driver in real-time (selectedId is now user._id)
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const driver = allUsers.find(u => u._id === selectedId);
    if (!driver?.lat) return;
    mapRef.current.panTo({ lat: Number(driver.lat), lng: Number(driver.lon) });
  }, [allUsers]);

  // ETA to delivery — recalculate at most every 30 seconds for the selected driver's load
  useEffect(() => {
    if (!isLoaded || !selectedId || !window.google) return;
    const driverView = allDriversView.find(d => d.user._id === selectedId);
    if (!driverView?.load) return;
    const { user, load } = driverView;
    if (!user?.lat || !user?.lon) return;
    if (!load?.addressDelivery || !load?.cityDelivery) return;

    const now = Date.now();
    if (now - (etaLastCalc.current[selectedId] || 0) < 30000) return;
    etaLastCalc.current[selectedId] = now;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: Number(user.lat), lng: Number(user.lon) },
        destination: `${load.addressDelivery}, ${load.cityDelivery}`,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const secs = result.routes[0]?.legs[0]?.duration?.value || 0;
          const h = Math.floor(secs / 3600);
          const m = Math.floor((secs % 3600) / 60);
          setEtaMap(prev => ({ ...prev, [selectedId]: h > 0 ? `${h}h ${m}m` : `${m}m` }));
        } else {
          setEtaMap(prev => ({ ...prev, [selectedId]: "N/A" }));
        }
      }
    );
  }, [selectedId, allUsers, loads, isLoaded]);

  const handleSelectDriver = (user) => {
    if (selectedId === user._id) {
      setSelectedId(null);
    } else {
      setSelectedId(user._id);
      if (mapRef.current && user.lat != null) {
        mapRef.current.panTo({ lat: Number(user.lat), lng: Number(user.lon) });
        mapRef.current.setZoom(16);
      }
    }
  };

  const getUnitLabel = (user) => {
    if (user?.unitNumber) return user.unitNumber;
    if (user?.vehicle) return user.vehicle;
    if (user?.name) return `${user.name} ${user.lastName || ""}`.trim();
    return "—";
  };

  /* ─── Edit Load Modal ─────────────────────────────── */

  const EditLoadModal = ({ load, onClose }) => {
    const toLocalDatetime = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d - offset).toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({
      datePickUp: toLocalDatetime(load.datePickUp),
      companyNamePickUp: load.companyNamePickUp || "",
      addressPickup: load.addressPickup || "",
      cityPickUp: load.cityPickUp || "",
      notePickUp: load.notePickUp || "",
      dateDelivery: toLocalDatetime(load.dateDelivery),
      companyDelivery: load.companyDelivery || "",
      addressDelivery: load.addressDelivery || "",
      cityDelivery: load.cityDelivery || "",
      noteDelivery: load.noteDelivery || "",
      rate: load.rate != null ? `$${Number(load.rate).toLocaleString("en-US")}` : "",
      state: load.state || "active",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "rate") {
        const digits = value.replace(/\D/g, "");
        const formatted = digits ? `$${Number(digits).toLocaleString("en-US")}` : "";
        setForm(f => ({ ...f, rate: formatted }));
        return;
      }
      setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const {
        datePickUp, companyNamePickUp, addressPickup, cityPickUp,
        dateDelivery, companyDelivery, addressDelivery, cityDelivery,
        rate, state, notePickUp, noteDelivery,
      } = form;

      if (!datePickUp || !companyNamePickUp || !addressPickup || !cityPickUp ||
          !dateDelivery || !companyDelivery || !addressDelivery || !cityDelivery || !rate) {
        Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("edit_load_missing_fields"), confirmButtonColor: "#2563eb" });
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${backendBaseUrl}/load/${load._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            datePickUp: new Date(datePickUp).toISOString(),
            companyNamePickUp, addressPickup, cityPickUp,
            notePickUp,
            dateDelivery: new Date(dateDelivery).toISOString(),
            companyDelivery, addressDelivery, cityDelivery,
            noteDelivery,
            rate: rate.replace(/\D/g, ""),
            state,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          onClose();
          Swal.fire({
            icon: "success",
            title: t("edit_load_success_title"),
            text: t("edit_load_success_text"),
            confirmButtonColor: "#2563eb",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("edit_load_error"), confirmButtonColor: "#2563eb" });
        }
      } catch {
        Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
      } finally {
        setLoading(false);
      }
    };

    const handleCancelLoad = async () => {
      const result = await Swal.fire({
        icon: "warning",
        title: t("edit_load_cancel_title"),
        text: t("edit_load_cancel_text"),
        showCancelButton: true,
        confirmButtonText: t("edit_load_cancel_yes"),
        cancelButtonText: t("edit_load_cancel_no"),
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
      });
      if (!result.isConfirmed) return;
      try {
        const response = await fetch(`${backendBaseUrl}/load/${load._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          onClose();
          Swal.fire({
            icon: "success",
            title: t("edit_load_cancel_success_title"),
            text: t("edit_load_cancel_success_text"),
            confirmButtonColor: "#2563eb",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({ icon: "error", title: t("common_error"), text: t("edit_load_cancel_error"), confirmButtonColor: "#2563eb" });
        }
      } catch {
        Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
      }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
    const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{t("edit_load_title")}</h2>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-2">
                <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs">👤</div>
                <span className="text-sm font-semibold text-white">
                  {load.user?.name} {load.user?.lastName}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              {/* State */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🔄</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t("edit_load_status")}</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_LABELS).filter(([key]) => key !== "all").map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, state: key }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        form.state === key
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📍</span>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t("edit_load_pickup")}</span>
                  <div className="flex-1 h-px bg-blue-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>{t("edit_load_date")}</label>
                    <input type="datetime-local" name="datePickUp" value={form.datePickUp} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_company")}</label>
                    <input type="text" name="companyNamePickUp" value={form.companyNamePickUp} onChange={handleChange} placeholder={t("edit_load_placeholder_company")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_address")}</label>
                    <input type="text" name="addressPickup" value={form.addressPickup} onChange={handleChange} placeholder={t("edit_load_placeholder_address")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_city")}</label>
                    <input type="text" name="cityPickUp" value={form.cityPickUp} onChange={handleChange} placeholder={t("edit_load_placeholder_city")} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>{t("edit_load_note_pickup")}</label>
                    <textarea name="notePickUp" value={form.notePickUp} onChange={handleChange} placeholder={t("edit_load_placeholder_pickup_note")} rows={2} className={inputClass + " resize-none"} />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚚</span>
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{t("edit_load_delivery")}</span>
                  <div className="flex-1 h-px bg-cyan-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>{t("edit_load_date")}</label>
                    <input type="datetime-local" name="dateDelivery" value={form.dateDelivery} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_company")}</label>
                    <input type="text" name="companyDelivery" value={form.companyDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_company")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_address")}</label>
                    <input type="text" name="addressDelivery" value={form.addressDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_address")} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t("edit_load_city")}</label>
                    <input type="text" name="cityDelivery" value={form.cityDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_city")} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>{t("edit_load_note_delivery")}</label>
                    <textarea name="noteDelivery" value={form.noteDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_delivery_note")} rows={2} className={inputClass + " resize-none"} />
                  </div>
                </div>
              </div>

              {/* Rate */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">💰</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t("edit_load_rate")}</span>
                  <div className="flex-1 h-px bg-emerald-100" />
                </div>
                <div className="max-w-[200px]">
                  <label className={labelClass}>{t("edit_load_amount")}</label>
                  <input
                    type="text"
                    name="rate"
                    value={form.rate}
                    onChange={handleChange}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-semibold text-emerald-700"
                  />
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCancelLoad}
                className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
              >
                {t("edit_load_cancel_btn")}
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium"
                >
                  {t("edit_load_close")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? t("edit_load_saving") : t("edit_load_save")}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  };

  const selectedDriverView = allDriversView.find(d => d.user._id === selectedId);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">{t("track_loading_map")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">

      {/* LEFT PANEL */}
      <div className="w-72 bg-white border-r flex flex-col overflow-hidden flex-shrink-0 shadow-sm">

        {/* Search bar */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={unitSearch}
              onChange={(e) => { setUnitSearch(e.target.value); setSelectedId(null); }}
              placeholder={t("loads_search_placeholder").replace("{count}", loads.length)}
              className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
            />
            {unitSearch && (
              <button
                onClick={() => { setUnitSearch(""); setSelectedId(null); }}
                className="text-gray-300 hover:text-gray-500 transition flex-shrink-0"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status filters */}
        <div className="px-3 py-2 border-b bg-gray-50 flex flex-wrap gap-1.5">
          {Object.keys(STATUS_LABELS).map(state => (
            <button
              key={state}
              onClick={() => { setFilter(state); setSelectedId(null); }}
              className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition ${
                filter === state
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {STATUS_LABELS[state]}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-4 py-2 border-b">
          <span className="text-xs text-gray-400 font-medium">
            {allDriversView.length} {allDriversView.length === 1 ? t("loads_count_one") : t("loads_count_many")}
            {selectedId && (
              <button onClick={() => setSelectedId(null)} className="cursor-pointer ml-2 text-blue-500 hover:text-blue-700 underline">
                {t("loads_show_all")}
              </button>
            )}
          </span>
        </div>

        {/* Driver list */}
        <div className="flex-1 overflow-y-auto">
          {allDriversView.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm">{t("loads_no_loads")}</p>
            </div>
          ) : (
            allDriversView.map(({ user, load }) => {
              const isSelected = selectedId === user._id;
              const hasLoad = !!load;
              const isMoving = load?.state === "on_the_way" || load?.state === "active";
              const fmt = (iso) => {
                if (!iso) return "—";
                const d = new Date(iso);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
                  " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              };

              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectDriver(user)}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-all select-none ${
                    isSelected ? "bg-blue-50 border-l-[3px] border-l-blue-500" : "border-l-[3px] border-l-transparent"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMoving ? "bg-green-400" : hasLoad ? "bg-gray-300" : "bg-gray-200"}`} />
                      <span className="font-semibold text-sm text-gray-800 truncate">{getUnitLabel(user)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {user.speed != null && (
                        <span className="text-xs font-bold text-green-600">{toMph(user.speed)} MPH</span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); copyTrackLink(user._id, t); }}
                        className="flex items-center gap-1 p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Copy tracking link"
                      >
                        <Link size={13} />
                        <span className="text-[11px] font-semibold">{t("loads_track")}</span>
                      </button>
                      {hasLoad && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditLoad(load); }}
                          className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit load"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.172-8.172z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status / no-load badge */}
                  <div className="mt-1.5 ml-4">
                    {hasLoad ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[load.state] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {STATUS_LABELS[load.state] || load.state}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-400 border-gray-200 italic">
                        {t("loads_no_active_load")}
                      </span>
                    )}
                  </div>

                  {/* Expanded details */}
                  {isSelected && (
                    <div className="mt-2 ml-4 space-y-1.5">
                      <p className="text-xs text-gray-400 truncate">{user.name} {user.lastName}</p>

                      {hasLoad ? (
                        <>
                          <div className="flex gap-1.5">
                            <span className="text-[10px] mt-0.5">📍</span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Pickup</p>
                              <p className="text-xs text-gray-600 truncate font-medium">{load.companyNamePickUp}</p>
                              <p className="text-[11px] text-gray-400 truncate">{load.addressPickup}, {load.cityPickUp}</p>
                              <p className="text-[11px] text-gray-400">{fmt(load.datePickUp)}</p>
                              {load.notePickUp && <p className="text-[11px] text-blue-500 italic mt-0.5">{load.notePickUp}</p>}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <span className="text-[10px] mt-0.5">🚚</span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wide leading-none mb-0.5">Delivery</p>
                              <p className="text-xs text-gray-600 truncate font-medium">{load.companyDelivery}</p>
                              <p className="text-[11px] text-gray-400 truncate">{load.addressDelivery}, {load.cityDelivery}</p>
                              <p className="text-[11px] text-gray-400">{fmt(load.dateDelivery)}</p>
                              {load.noteDelivery && <p className="text-[11px] text-cyan-500 italic mt-0.5">{load.noteDelivery}</p>}
                            </div>
                          </div>
                          {load.rate != null && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px]">💰</span>
                              <span className="text-xs font-bold text-emerald-600">${Number(load.rate).toLocaleString("en-US")}</span>
                            </div>
                          )}
                          {etaMap[user._id] && (
                            etaMap[user._id] === "N/A" ? (
                              <div className="flex items-center gap-1.5 bg-gray-50 rounded-md px-2 py-1">
                                <span className="text-[10px]">⚠️</span>
                                <span className="text-[11px] text-gray-400 italic">{t("loads_eta_unavailable")}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 bg-blue-50 rounded-md px-2 py-1">
                                <span className="text-[10px]">⏱️</span>
                                <span className="text-[11px] font-semibold text-blue-600">
                                  {t("loads_eta_label")}: <span className="font-bold">{etaMap[user._id]}</span>
                                </span>
                              </div>
                            )
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-300 italic">{t("loads_no_active_load")}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected footer */}
        {selectedDriverView && (
          <div className="border-t bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold truncate">{getUnitLabel(selectedDriverView.user)}</p>
            {selectedDriverView.user?.lat && (
              <p className="text-blue-500 mt-0.5">{toMph(selectedDriverView.user.speed ?? 0)} MPH</p>
            )}
          </div>
        )}

      </div>

      {editLoad && (
        <EditLoadModal
          load={editLoad}
          onClose={() => setEditLoad(null)}
        />
      )}

      {/* MAP */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          onLoad={handleMapLoad}
          options={MAP_OPTIONS}
        >
          {/* Always show ALL drivers with a known location */}
          {usersWithLocation.map(user => {
            // Find an active (non-completed) load for this driver
            const userLoad = loads.find(
              l => l.user?._id === user._id && l.state !== "completed"
            );
            const isSelected = selectedId === user._id;
            const unitLabel = user.unitNumber || user.vehicle || user.name || "—";
            const bg = isSelected ? "#2563eb" : "#1e293b";

            return (
              <OverlayView
                key={user._id}
                position={{ lat: Number(user.lat), lng: Number(user.lon) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => handleSelectDriver(user)}
                  className="select-none inline-block cursor-pointer"
                  style={{
                    transform: "translate(-50%, calc(-100% - 6px))",
                    filter: isSelected
                      ? "drop-shadow(0 2px 6px rgba(37,99,235,0.5))"
                      : "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
                  }}
                >
                  {/* Label bubble — unit number + track icon */}
                  <div style={{
                    backgroundColor: bg,
                    color: "white",
                    fontSize: isSelected ? "11px" : "10px",
                    fontWeight: "700",
                    padding: isSelected ? "4px 8px" : "3px 6px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                    fontFamily: "system-ui, sans-serif",
                    opacity: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                    <span>{unitLabel}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyTrackLink(user._id, t); }}
                      title="Copy tracking link"
                      style={{
                        background: "rgba(255,255,255,0.20)",
                        border: "none",
                        borderRadius: "3px",
                        cursor: "pointer",
                        padding: "1px 3px",
                        lineHeight: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <svg
                        width={isSelected ? "10" : "9"}
                        height={isSelected ? "10" : "9"}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </button>
                  </div>
                  {/* Arrow */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${bg}`,
                    margin: "0 auto",
                    opacity: 1,
                  }} />
                  {/* Pin dot */}
                  <div style={{
                    width: isSelected ? "8px" : "6px",
                    height: isSelected ? "8px" : "6px",
                    borderRadius: "50%",
                    backgroundColor: bg,
                    border: "2px solid white",
                    margin: "0 auto",
                    marginTop: "-1px",
                    opacity: 1,
                  }} />
                </div>
              </OverlayView>
            );
          })}
        </GoogleMap>
      </div>

    </div>
  );

};
