import { useEffect, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import Swal from "sweetalert2";

export const Loads = () => {

  const [loads, setLoads] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getLoads();
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

    return colors[state];
  };

  const filteredLoads = loads.filter(load => {
    if (filter === "all") return true;
    return load.state === filter;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold text-gray-800">
          Cargas
        </h2>

        {/* FILTROS */}
        <div className="flex gap-2">

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


      {/* LISTA DE CARGAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredLoads.map(load => (

          <div
            key={load._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-4"
          >

            {/* RUTA */}
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


            {/* EMPRESAS */}
            <div className="text-sm text-gray-700">

              <div>
                <span className="font-semibold">Pickup:</span> {load.companyNamePickUp}
              </div>

              <div>
                <span className="font-semibold">Delivery:</span> {load.companyDelivery}
              </div>

            </div>


            {/* FECHAS */}
            <div className="text-xs text-gray-500 flex justify-between">

              <span>📅 {load.datePickUp}</span>
              <span>📅 {load.dateDelivery}</span>

            </div>


            {/* ESTADO */}
            <div className="flex justify-between items-center">

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateColor(load.state)}`}>
                {load.state}
              </span>

              <span className="text-xs text-gray-500">
                {getProgress(load.state)}%
              </span>

            </div>


            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${getProgress(load.state)}%` }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};