import { useEffect, useRef, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";

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

export const Loads = () => {

  const [loads, setLoads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    getLoads();
    const interval = setInterval(getLoads, 5000);
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

  const filteredLoads = loads.filter(load =>
    filter === "all" || load.state === filter
  );

  const loadsWithLocation = filteredLoads.filter(
    load => load.user?.lat != null && load.user?.lon != null
  );

  const fitAll = (map, items) => {
    if (!map || items.length === 0) return;
    if (items.length === 1) {
      map.setCenter({ lat: Number(items[0].user.lat), lng: Number(items[0].user.lon) });
      map.setZoom(14);
      return;
    }
    const bounds = new window.google.maps.LatLngBounds();
    items.forEach(load => {
      bounds.extend({ lat: Number(load.user.lat), lng: Number(load.user.lon) });
    });
    map.fitBounds(bounds, 80);
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (!mapRef.current || selectedId || loadsWithLocation.length === 0) return;
    fitAll(mapRef.current, loadsWithLocation);
  }, [loads, filter, selectedId]);

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
    if (load.user?.vehicle) return load.user.vehicle;
    if (load.user?.name) return `${load.user.name} ${load.user.lastName || ""}`.trim();
    return `Unit ${load._id?.slice(-6).toUpperCase()}`;
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
            <span className="text-sm text-gray-400">
              Filter {loads.length} assets
            </span>
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

        {/* Driver list */}
        <div className="flex-1 overflow-y-auto">
          {filteredLoads.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm">No loads found</p>
            </div>
          ) : (
            filteredLoads.map(load => (
              <div
                key={load._id}
                onClick={() => handleSelectLoad(load)}
                className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition-all select-none ${
                  selectedId === load._id
                    ? "bg-blue-50 border-l-[3px] border-l-blue-500"
                    : "border-l-[3px] border-l-transparent"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      load.state === "on_the_way" || load.state === "active" ? "bg-green-400" : "bg-gray-300"
                    }`} />
                    <span className="font-semibold text-sm text-gray-800 truncate">
                      {getUnitLabel(load)}
                    </span>
                  </div>
                  {load.user?.speed != null && (
                    <span className="text-xs font-bold text-green-600 whitespace-nowrap flex-shrink-0">
                      {load.user.speed} MPH
                    </span>
                  )}
                </div>

                {load.user && load.user.name !== getUnitLabel(load) && (
                  <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
                    {load.user.name} {load.user.lastName}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
                  📍 {load.cityPickUp} → {load.cityDelivery}
                </p>

                <div className="mt-1.5 ml-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${
                    STATUS_COLORS[load.state] || "bg-gray-100 text-gray-600 border-gray-200"
                  }`}>
                    {STATUS_LABELS[load.state] || load.state}
                  </span>
                </div>
              </div>
            ))
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

      {/* MAP */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          onLoad={handleMapLoad}
          options={MAP_OPTIONS}
        >
          {loadsWithLocation.map(load => {
            const isSelected = selectedId === load._id;
            const label = getUnitLabel(load);
            const bg = isSelected ? "#2563eb" : "#1e293b";
            return (
              <OverlayView
                key={load._id}
                position={{ lat: Number(load.user.lat), lng: Number(load.user.lon) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => handleSelectLoad(load)}
                  className="cursor-pointer select-none inline-block"
                  style={{
                    transform: "translate(-50%, calc(-100% - 6px))",
                    filter: isSelected ? "drop-shadow(0 2px 6px rgba(37,99,235,0.5))" : "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
                  }}
                >
                  {/* Label bubble */}
                  <div style={{
                    backgroundColor: bg,
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {label}
                  </div>
                  {/* Arrow */}
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: `6px solid ${bg}`,
                    margin: "0 auto",
                  }} />
                  {/* Pin dot */}
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: bg,
                    border: "2px solid white",
                    margin: "0 auto",
                    marginTop: "-1px",
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
