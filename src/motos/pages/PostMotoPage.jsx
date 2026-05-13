import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Bike, Image, ChevronRight, X, AlertCircle } from "lucide-react";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import { PaymentModal } from "../components/PaymentModal";
import {
  apiCreateListing, apiUpdateListing, apiGetListing,
  MOTO_TYPES, MOTO_BRANDS, CITIES
} from "../api/motosApi";
import { useMotos } from "../context/MotosContext";
import Swal from "sweetalert2";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i);

const INITIAL = {
  brand: "", model: "", year: CURRENT_YEAR, type: "", engine: "", mileage: "", color: "",
  price: "", city: "", description: "", phone: "", whatsapp: "", plate: "",
  photos: [], // URLs
};

export const PostMotoPage = () => {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const { motosUser } = useMotos();

  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [errors, setErrors] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [photoInput, setPhotoInput] = useState("");

  const isEdit = !!id;

  // Redirect if not logged in
  useEffect(() => {
    if (!motosUser) navigate("/motos/login");
  }, [motosUser, navigate]);

  // Load existing listing for edit
  useEffect(() => {
    if (!id) return;
    setFetchLoading(true);
    apiGetListing(id)
      .then(data => {
        if (data?._id) {
          setForm({
            brand: data.brand || "",
            model: data.model || "",
            year: data.year || CURRENT_YEAR,
            type: data.type || "",
            engine: data.engine || "",
            mileage: data.mileage ?? "",
            color: data.color || "",
            price: data.price ?? "",
            city: data.city || "",
            description: data.description || "",
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            plate: data.plate || "",
            photos: data.photos || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetchLoading(false));
  }, [id]);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }));
  };

  const addPhoto = () => {
    const url = photoInput.trim();
    if (!url) return;
    if (form.photos.includes(url)) return;
    if (form.photos.length >= 8) return Swal.fire({ icon: "info", title: "Máximo 8 fotos", confirmButtonColor: "#f97316" });
    set("photos", [...form.photos, url]);
    setPhotoInput("");
  };

  const removePhoto = (idx) => set("photos", form.photos.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!form.brand) e.brand = "Selecciona la marca";
    if (!form.model.trim()) e.model = "Ingresa el modelo";
    if (!form.type) e.type = "Selecciona el tipo";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Precio inválido";
    if (!form.city) e.city = "Selecciona la ciudad";
    if (!form.phone.trim() && !form.whatsapp.trim()) e.phone = "Ingresa al menos un número de contacto";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        mileage: form.mileage !== "" ? Number(form.mileage) : undefined,
        year: Number(form.year),
      };
      let res;
      if (isEdit) {
        res = await apiUpdateListing(id, body);
        if (res._id || res.ok) {
          Swal.fire({ icon: "success", title: "¡Actualizado!", text: "Tu anuncio fue actualizado.", confirmButtonColor: "#f97316", timer: 2000, showConfirmButton: false });
          navigate("/motos/panel");
        } else {
          Swal.fire({ icon: "error", title: "Error", text: res.message || "No se pudo actualizar", confirmButtonColor: "#f97316" });
        }
      } else {
        res = await apiCreateListing(body);
        if (res._id) {
          setCreatedId(res._id);
          setShowPayment(true);
        } else {
          Swal.fire({ icon: "error", title: "Error", text: res.message || "No se pudo publicar", confirmButtonColor: "#f97316" });
        }
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Error de conexión", confirmButtonColor: "#f97316" });
    } finally {
      setLoading(false);
    }
  };

  const Label = ({ children, req }) => (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {children}{req && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  const inputCls = (field) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition bg-white ${
      errors[field]
        ? "border-red-300 focus:ring-2 focus:ring-red-300"
        : "border-gray-200 focus:ring-2 focus:ring-orange-400"
    }`;

  if (fetchLoading) return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/motos/panel" className="hover:text-orange-500 transition">Mi panel</Link>
            <ChevronRight size={13} />
            <span className="text-gray-700 font-medium">{isEdit ? "Editar anuncio" : "Publicar moto"}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEdit ? "Editar anuncio" : "Publicar mi moto"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isEdit ? "Actualiza la información de tu anuncio" : "Completa el formulario para publicar tu moto gratis"}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Section: Vehicle info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <Bike size={16} className="text-orange-500" /> Datos del vehículo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Brand */}
              <div>
                <Label req>Marca</Label>
                <select value={form.brand} onChange={e => set("brand", e.target.value)} className={inputCls("brand")}>
                  <option value="">Seleccionar marca</option>
                  {MOTO_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.brand && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.brand}</p>}
              </div>

              {/* Model */}
              <div>
                <Label req>Modelo</Label>
                <input type="text" value={form.model} onChange={e => set("model", e.target.value)}
                  placeholder="CBR 600RR, MT-07, etc." className={inputCls("model")} />
                {errors.model && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.model}</p>}
              </div>

              {/* Year */}
              <div>
                <Label req>Año</Label>
                <select value={form.year} onChange={e => set("year", e.target.value)} className={inputCls("year")}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Type */}
              <div>
                <Label req>Tipo</Label>
                <select value={form.type} onChange={e => set("type", e.target.value)} className={inputCls("type")}>
                  <option value="">Seleccionar tipo</option>
                  {MOTO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.type}</p>}
              </div>

              {/* Engine */}
              <div>
                <Label>Motor</Label>
                <input type="text" value={form.engine} onChange={e => set("engine", e.target.value)}
                  placeholder="600cc, 150cc, etc." className={inputCls("engine")} />
              </div>

              {/* Color */}
              <div>
                <Label>Color</Label>
                <input type="text" value={form.color} onChange={e => set("color", e.target.value)}
                  placeholder="Rojo, Negro, Azul..." className={inputCls("color")} />
              </div>

              {/* Mileage */}
              <div>
                <Label>Kilometraje</Label>
                <input type="number" value={form.mileage} onChange={e => set("mileage", e.target.value)}
                  placeholder="25000" min={0} className={inputCls("mileage")} />
              </div>

              {/* Plate */}
              <div>
                <Label>Placa</Label>
                <input type="text" value={form.plate} onChange={e => set("plate", e.target.value.toUpperCase())}
                  placeholder="ABC123" maxLength={6} className={inputCls("plate")} />
              </div>
            </div>
          </div>

          {/* ── Section: Sale info ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-5">Información de venta</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <Label req>Precio (COP)</Label>
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-orange-400 transition bg-white border-gray-200">
                  <span className="text-gray-400 text-sm font-medium">$</span>
                  <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                    placeholder="8500000" min={0}
                    className="flex-1 text-sm outline-none bg-transparent" />
                </div>
                {form.price && !isNaN(Number(form.price)) && (
                  <p className="text-xs text-gray-400 mt-1">${Number(form.price).toLocaleString("es-CO")}</p>
                )}
                {errors.price && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.price}</p>}
              </div>

              {/* City */}
              <div>
                <Label req>Ciudad</Label>
                <select value={form.city} onChange={e => set("city", e.target.value)} className={inputCls("city")}>
                  <option value="">Seleccionar ciudad</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.city}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label>Teléfono</Label>
                <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                  placeholder="310 000 0000" className={inputCls("phone")} />
              </div>

              {/* WhatsApp */}
              <div>
                <Label req>WhatsApp</Label>
                <input type="tel" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)}
                  placeholder="310 000 0000" className={inputCls("phone")} />
                {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.phone}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <Label>Descripción</Label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe el estado de la moto, accesorios incluidos, historial de mantenimiento, razón de venta..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 transition resize-none bg-white" />
              <p className="text-xs text-gray-400 text-right mt-1">{form.description.length}/1000</p>
            </div>
          </div>

          {/* ── Section: Photos ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Image size={16} className="text-orange-500" /> Fotos
            </h2>
            <p className="text-xs text-gray-400 mb-4">Agrega hasta 8 URLs de fotos de tu moto (Imgur, Google Drive, etc.)</p>

            {/* Add photo */}
            <div className="flex gap-2 mb-4">
              <input type="url" value={photoInput} onChange={e => setPhotoInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addPhoto())}
                placeholder="https://i.imgur.com/..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
              <button type="button" onClick={addPhoto}
                className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition flex-shrink-0">
                Agregar
              </button>
            </div>

            {/* Photo grid */}
            {form.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {form.photos.map((url, i) => (
                  <div key={i} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover"
                      onError={e => { e.target.parentElement.style.background = "#fee2e2"; }} />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                        Principal
                      </div>
                    )}
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3">
            <Link to="/motos/panel"
              className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancelar
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Publicando..." : isEdit ? "Guardar cambios" : "Publicar moto"}
            </button>
          </div>
        </form>
      </div>

      {/* Payment modal after creation */}
      {showPayment && createdId && (
        <PaymentModal
          listingId={createdId}
          currentPlan="basica"
          onClose={() => { setShowPayment(false); navigate("/motos/panel"); }}
          onSuccess={() => navigate("/motos/panel")}
        />
      )}

      <Footer />
    </div>
  );
};
