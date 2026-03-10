import { useEffect, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export const Loads = () => {

  const [loads, setLoads] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {

    getLoads();

    const interval = setInterval(() => {
      getLoads();
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

  const getProgress = (state) => {

    const states = {
      active: 20,
      picked_up: 40,
      on_the_way: 60,
      delivered: 80,
      completed: 100
    };

    return states[state] || 0;

  };

  const getStateColor = (state) => {

    const colors = {
      active: "bg-blue-100 text-blue-700",
      picked_up: "bg-purple-100 text-purple-700",
      on_the_way: "bg-yellow-100 text-yellow-700",
      delivered: "bg-orange-100 text-orange-700",
      completed: "bg-green-100 text-green-700"
    };

    return colors[state] || "bg-gray-100 text-gray-700";

  };

  const filteredLoads = loads.filter(load => {
    if (filter === "all") return true;
    return load.state === filter;
  });

  const formatMoney = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (

    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>

      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold text-gray-800">
            Loads
          </h2>

          <div className="flex gap-2 flex-wrap">

            {["all","active","picked_up","on_the_way","delivered","completed"].map(state => (

              <button
                key={state}
                onClick={() => setFilter(state)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  filter === state
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {state}
              </button>

            ))}

          </div>

        </div>

        {/* FIRST LOAD */}
        {loads.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-gray-500">

            <p className="text-lg">
              Loading loads...
            </p>

          </div>

        ) : filteredLoads.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20 text-gray-500">

            <div className="text-5xl mb-3">
              📦
            </div>

            <p className="text-lg font-medium">
              No loads available
            </p>

            <p className="text-sm text-gray-400">
              There are currently no loads for this filter
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredLoads.map(load => (

              <div
                key={load._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-4"
              >

                {load.rate && (
  <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg px-4 py-3">
    
    <span className="text-xs font-medium text-green-700 uppercase tracking-wide">
      Rate
    </span>

    <span className="text-2xl font-bold text-green-700">
      {formatMoney(load.rate)}
    </span>

  </div>
)}

                {load.user && (
                  <div className="text-sm font-medium text-gray-700">
                    Driver: {load.user.name} {load.user.lastName}
                  </div>
                )}

                <div className="space-y-1">

                  <div className="flex items-center text-sm text-gray-500">
                    📍 {load.cityPickUp}
                  </div>

                  <div className="text-xs text-gray-400 ml-4">
                    {load.addressPickup}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    🚚 {load.cityDelivery}
                  </div>

                  <div className="text-xs text-gray-400 ml-4">
                    {load.addressDelivery}
                  </div>

                </div>

                <div className="flex justify-between items-center">

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(load.state)}`}>
                    {load.state}
                  </span>

                  <span className="text-xs text-gray-500">
                    {getProgress(load.state)}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">

                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${getProgress(load.state)}%` }}
                  />

                </div>

                {load.user?.lat != null && load.user?.lon != null && (
                  <div className="rounded-lg overflow-hidden border">

                    <GoogleMap
                      key={`${load.user.lat}-${load.user.lon}`}
                      mapContainerStyle={{
                        width: "100%",
                        height: "180px"
                      }}
                      center={{
                        lat: Number(load.user.lat),
                        lng: Number(load.user.lon)
                      }}
                      zoom={12}
                      options={{
                        disableDefaultUI: true,
                        zoomControl: true
                      }}
                    >

                      <Marker
                        position={{
                          lat: Number(load.user.lat),
                          lng: Number(load.user.lon)
                        }}
                      />

                    </GoogleMap>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </LoadScript>

  );

};