import { Link } from "react-router";
import { MapPin, Calendar, Gauge, Star } from "lucide-react";

const fmt = (n) => n?.toLocaleString("es-CO") ?? "—";

export const MotoCard = ({ moto }) => {
  const photo = moto.photos?.[0] || moto.photo || null;
  const featured = moto.plan === "destacada";

  return (
    <Link
      to={`/motos/moto/${moto._id}`}
      className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border ${
        featured ? "border-orange-300 ring-1 ring-orange-200" : "border-gray-100"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={`${moto.brand} ${moto.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏍️</div>
        )}
        {featured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            <Star size={10} fill="white" /> DESTACADA
          </div>
        )}
        {moto.state === "sold" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">VENDIDA</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-600 transition line-clamp-2">
            {moto.brand} {moto.model} {moto.year}
          </h3>
          <span className="text-orange-600 font-bold text-sm whitespace-nowrap">
            ${fmt(moto.price)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {moto.type && (
            <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">
              {moto.type}
            </span>
          )}
          {moto.engine && (
            <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {moto.engine}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {moto.city}
          </span>
          {moto.mileage != null && (
            <span className="flex items-center gap-1">
              <Gauge size={11} /> {fmt(moto.mileage)} km
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {moto.year}
          </span>
        </div>
      </div>
    </Link>
  );
};
