import { useEffect, useRef, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import Swal from "sweetalert2";
import { X } from "lucide-react";

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

const STATUS_LABELS = {
  all: "All",
  active: "Active",
  picked_up: "Picked up",
  on_the_way: "On the way",
  delivered: "Delivered",
  completed: "Completed",
};

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

  const [loads, setLoads] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [unitSearch, setUnitSearch] = useState("");
  const mapRef = useRef(null);
  const [editLoad, setEditLoad] = useState(null);

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

  // Exclude completed from "All" filter; sort A-Z by unit number
  const filteredLoads = loads
    .filter(load => {
      if (filter === "all" && load.state === "completed") return false;
      const matchesStatus = filter === "all" || load.state === filter;
      const matchesUnit =
        unitSearch === "" ||
        load.user?.unitNumber
          ?.toString()
          .toLowerCase()
          .includes(unitSearch.toLowerCase());
      return matchesStatus && matchesUnit;
    })
    .sort((a, b) => {
      const ua = (a.user?.unitNumber || "").toString();
      const ub = (b.user?.unitNumber || "").toString();
      return ua.localeCompare(ub, undefined, { numeric: true });
    });

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

  // Follow selected driver in real-time
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const load = loads.find(l => l._id === selectedId);
    if (!load?.user?.lat) return;
    mapRef.current.panTo({
      lat: Number(load.user.lat),
      lng: Number(load.user.lon),
    });
  }, [loads]);

  const handleSelectLoad = (load) => {
    if (selectedId === load._id) {
      setSelectedId(null);
    } else {
      setSelectedId(load._id);
      if (mapRef.current && load.user?.lat != null) {
        mapRef.current.panTo({
          lat: Number(load.user.lat),
          lng: Number(load.user.lon),
        });
        mapRef.current.setZoom(16);
      }
    }
  };

  const getUnitLabel = (load) => {
    if (load.user?.unitNumber) return load.user.unitNumber;
    if (load.user?.vehicle) return load.user.vehicle;
    if (load.user?.name) return `${load.user.name} ${load.user.lastName || ""}`.trim();
    return `Unit ${load._id?.slice(-6).toUpperCase()}`;
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
        Swal.fire({ icon: "warning", title: "Missing fields", text: "All fields are required", confirmButtonColor: "#2563eb" });
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
            title: "Load updated",
            text: "The load was updated successfully",
            confirmButtonColor: "#2563eb",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({ icon: "error", title: "Error", text: data.message || "Could not update the load", confirmButtonColor: "#2563eb" });
        }
      } catch {
        Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });
      } finally {
        setLoading(false);
      }
    };

    const handleCancelLoad = async () => {
      const result = await Swal.fire({
        icon: "warning",
        title: "Cancel Load?",
        text: "The driver will be notified that this load has been cancelled.",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "Keep it",
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
            title: "Load cancelled",
            text: "The driver has been notified.",
            confirmButtonColor: "#2563eb",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({ icon: "error", title: "Error", text: "Could not cancel the load", confirmButtonColor: "#2563eb" });
        }
      } catch {
        Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });
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
              <h2 className="text-xl font-bold text-white">Edit Load</h2>
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
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
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
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pickup</span>
                  <div className="flex-1 h-px bg-blue-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Date & Time</label>
                    <input type="datetime-local" name="datePickUp" value={form.datePickUp} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" name="companyNamePickUp" value={form.companyNamePickUp} onChange={handleChange} placeholder="Company name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" name="addressPickup" value={form.addressPickup} onChange={handleChange} placeholder="Street address" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="cityPickUp" value={form.cityPickUp} onChange={handleChange} placeholder="City" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Note for driver (pickup)</label>
                    <textarea name="notePickUp" value={form.notePickUp} onChange={handleChange} placeholder="Instructions for pickup..." rows={2} className={inputClass + " resize-none"} />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🚚</span>
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Delivery</span>
                  <div className="flex-1 h-px bg-cyan-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Date & Time</label>
                    <input type="datetime-local" name="dateDelivery" value={form.dateDelivery} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input type="text" name="companyDelivery" value={form.companyDelivery} onChange={handleChange} placeholder="Company name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" name="addressDelivery" value={form.addressDelivery} onChange={handleChange} placeholder="Street address" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="cityDelivery" value={form.cityDelivery} onChange={handleChange} placeholder="City" className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Note for driver (delivery)</label>
                    <textarea name="noteDelivery" value={form.noteDelivery} onChange={handleChange} placeholder="Instructions for delivery..." rows={2} className={inputClass + " resize-none"} />
                  </div>
                </div>
              </div>

              {/* Rate */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">💰</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Rate</span>
                  <div className="flex-1 h-px bg-emerald-100" />
                </div>
                <div className="max-w-[200px]">
                  <label className={labelClass}>Amount</label>
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
                Cancel Load
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    );
  };

  const selectedLoad = loads.find(l => l._id === selectedId);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading map...</p>
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
              placeholder={`Search ${loads.length} assets...`}
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
            {filteredLoads.length} {filteredLoads.length === 1 ? "load" : "loads"}
            {selectedId && (
              <button
                onClick={() => setSelectedId(null)}
                className="cursor-pointer ml-2 text-blue-500 hover:text-blue-700 underline"
              >
                Show all
              </button>
            )}
          </span>
        </div>

        {/* Driver list — compact by default, expanded when selected */}
        <div className="flex-1 overflow-y-auto">
          {filteredLoads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm">No loads found</p>
            </div>
          ) : (
            filteredLoads.map(load => {
              const isSelected = selectedId === load._id;
              const fmt = (iso) => {
                if (!iso) return "—";
                const d = new Date(iso);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
                  " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
              };

              return (
                <div
                  key={load._id}
                  onClick={() => handleSelectLoad(load)}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-all select-none ${
                    isSelected
                      ? "bg-blue-50 border-l-[3px] border-l-blue-500"
                      : "border-l-[3px] border-l-transparent"
                  }`}
                >
                  {/* ── Top row: unit label + speed + edit ── */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        load.state === "on_the_way" || load.state === "active" ? "bg-green-400" : "bg-gray-300"
                      }`} />
                      <span className="font-semibold text-sm text-gray-800 truncate">
                        {getUnitLabel(load)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {load.user?.speed != null && (
                        <span className="text-xs font-bold text-green-600">
                          {toMph(load.user.speed)} MPH
                        </span>
                      )}
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
                    </div>
                  </div>

                  {/* Status badge — always visible */}
                  <div className="mt-1.5 ml-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                      STATUS_COLORS[load.state] || "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                      {STATUS_LABELS[load.state] || load.state}
                    </span>
                  </div>

                  {/* ── Expanded details (only when selected) ── */}
                  {isSelected && (
                    <div className="mt-2 ml-4 space-y-1.5">

                      {/* Driver name */}
                      {load.user && (
                        <p className="text-xs text-gray-400 truncate">
                          {load.user.name} {load.user.lastName}
                        </p>
                      )}

                      {/* Pickup */}
                      <div className="flex gap-1.5">
                        <span className="text-[10px] mt-0.5">📍</span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide leading-none mb-0.5">Pickup</p>
                          <p className="text-xs text-gray-600 truncate font-medium">{load.companyNamePickUp}</p>
                          <p className="text-[11px] text-gray-400 truncate">{load.addressPickup}, {load.cityPickUp}</p>
                          <p className="text-[11px] text-gray-400">{fmt(load.datePickUp)}</p>
                          {load.notePickUp && (
                            <p className="text-[11px] text-blue-500 italic mt-0.5">{load.notePickUp}</p>
                          )}
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="flex gap-1.5">
                        <span className="text-[10px] mt-0.5">🚚</span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wide leading-none mb-0.5">Delivery</p>
                          <p className="text-xs text-gray-600 truncate font-medium">{load.companyDelivery}</p>
                          <p className="text-[11px] text-gray-400 truncate">{load.addressDelivery}, {load.cityDelivery}</p>
                          <p className="text-[11px] text-gray-400">{fmt(load.dateDelivery)}</p>
                          {load.noteDelivery && (
                            <p className="text-[11px] text-cyan-500 italic mt-0.5">{load.noteDelivery}</p>
                          )}
                        </div>
                      </div>

                      {/* Rate */}
                      {load.rate != null && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]">💰</span>
                          <span className="text-xs font-bold text-emerald-600">
                            ${Number(load.rate).toLocaleString("en-US")}
                          </span>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected detail footer */}
        {selectedLoad && (
          <div className="border-t bg-blue-50 px-4 py-3 text-xs text-blue-700">
            <p className="font-semibold truncate">{getUnitLabel(selectedLoad)}</p>
            {selectedLoad.user?.lat && (
              <p className="text-blue-500 mt-0.5">
                {Number(selectedLoad.user.lat).toFixed(5)}, {Number(selectedLoad.user.lon).toFixed(5)}
              </p>
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
            const isSelected = userLoad ? selectedId === userLoad._id : false;
            const unitLabel = user.unitNumber || user.vehicle || user.name || "—";
            const bg = isSelected ? "#2563eb" : "#1e293b";

            return (
              <OverlayView
                key={user._id}
                position={{ lat: Number(user.lat), lng: Number(user.lon) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => userLoad && handleSelectLoad(userLoad)}
                  className={`select-none inline-block ${userLoad ? "cursor-pointer" : "cursor-default"}`}
                  style={{
                    transform: "translate(-50%, calc(-100% - 6px))",
                    filter: isSelected
                      ? "drop-shadow(0 2px 6px rgba(37,99,235,0.5))"
                      : "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
                  }}
                >
                  {/* Label bubble — compact: unit number only */}
                  <div style={{
                    backgroundColor: bg,
                    color: "white",
                    fontSize: isSelected ? "11px" : "10px",
                    fontWeight: "700",
                    padding: isSelected ? "4px 10px" : "3px 7px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                    fontFamily: "system-ui, sans-serif",
                    opacity: userLoad ? 1 : 0.7,
                  }}>
                    {unitLabel}
                  </div>
                  {/* Arrow */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${bg}`,
                    margin: "0 auto",
                    opacity: userLoad ? 1 : 0.7,
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
                    opacity: userLoad ? 1 : 0.7,
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
