import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { backendBaseUrl } from "../utils/funciones";

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

const toMph = (kmh) => Math.round(kmh * 0.621371);

export const TrackPage = () => {
  const { driverId } = useParams();
  const [driver, setDriver] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const mapRef = useRef(null);
  const hasCentered = useRef(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const fetchDriver = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/users`);
      const data = await res.json();
      const found = data.find((u) => u._id === driverId);
      if (!found) {
        setNotFound(true);
        return;
      }
      setDriver(found);
    } catch {
      // silently retry on next interval
    }
  };

  useEffect(() => {
    fetchDriver();
    const interval = setInterval(fetchDriver, 5000);
    return () => clearInterval(interval);
  }, [driverId]);

  // Center map on driver once location is available
  useEffect(() => {
    if (!mapRef.current || !driver?.lat || hasCentered.current) return;
    mapRef.current.panTo({ lat: Number(driver.lat), lng: Number(driver.lon) });
    mapRef.current.setZoom(14);
    hasCentered.current = true;
  }, [driver]);

  // Follow driver in real-time after first center
  useEffect(() => {
    if (!mapRef.current || !driver?.lat || !hasCentered.current) return;
    mapRef.current.panTo({ lat: Number(driver.lat), lng: Number(driver.lon) });
  }, [driver?.lat, driver?.lon]);

  if (notFound) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold text-gray-700 mb-2">Driver not found</h1>
          <p className="text-sm text-gray-400">This tracking link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const hasLocation = driver?.lat != null && driver?.lon != null;
  const unitLabel = driver?.unitNumber || driver?.vehicle || driver?.name || "—";

  return (
    <div className="h-screen flex flex-col bg-gray-900">

      {/* Top bar */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          {driver ? (
            <>
              <p className="text-sm font-bold text-gray-800 truncate">
                {driver.name} {driver.lastName}
                <span className="ml-2 text-xs font-normal text-gray-400">Unit #{unitLabel}</span>
              </p>
              <p className="text-xs text-gray-400">
                {hasLocation ? (
                  <>
                    Live location
                    {driver.speed != null && (
                      <span className="ml-2 font-semibold text-green-600">{toMph(driver.speed)} MPH</span>
                    )}
                  </>
                ) : (
                  "Waiting for location..."
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Loading driver info...</p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${hasLocation ? "bg-green-400 animate-pulse" : "bg-gray-300"}`} />
          <span className="text-xs text-gray-400">{hasLocation ? "Live" : "No signal"}</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            onLoad={(map) => { mapRef.current = map; }}
            options={MAP_OPTIONS}
          >
            {hasLocation && (
              <OverlayView
                position={{ lat: Number(driver.lat), lng: Number(driver.lon) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  className="select-none inline-block cursor-default"
                  style={{
                    transform: "translate(-50%, calc(-100% - 6px))",
                    filter: "drop-shadow(0 2px 6px rgba(37,99,235,0.5))",
                  }}
                >
                  <div style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                    fontFamily: "system-ui, sans-serif",
                  }}>
                    {unitLabel}
                    {driver.speed != null && (
                      <span style={{ marginLeft: "6px", fontWeight: "400", opacity: 0.85 }}>
                        {toMph(driver.speed)} MPH
                      </span>
                    )}
                  </div>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "6px solid #2563eb",
                    margin: "0 auto",
                  }} />
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    border: "2px solid white",
                    margin: "0 auto",
                    marginTop: "-1px",
                  }} />
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-400 text-sm">Loading map...</p>
          </div>
        )}
      </div>

    </div>
  );
};
