import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bike, User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { apiRegister } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";
import { LanguageSwitch } from "../../Components/LanguageSwitch";

const inputCls = "flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-300";
const wrapCls  = "flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-orange-400 transition";
const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { motosLogin } = useMotos();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError("Nombre, email y contraseña son obligatorios.");
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");
    setError("");
    setLoading(true);
    try {
      const res = await apiRegister({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });
      if (res.token) {
        motosLogin(res.token);
        navigate("/motos/panel");
      } else {
        setError(res.message || "No se pudo crear la cuenta. Intenta con otro email.");
      }
    } catch {
      setError("Error de conexión. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <div className="bg-gray-900 px-6 py-4">
        <Link to="/motos" className="flex items-center gap-2.5 font-bold text-xl text-white w-fit">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Bike size={18} className="text-white" />
          </div>
          <span>Moto<span className="text-orange-500">Market</span></span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Crear cuenta</h1>
            <p className="text-sm text-gray-400 mb-7">Regístrate gratis y publica tu primera moto hoy</p>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className={labelCls}>Nombre completo</label>
                <div className={wrapCls}>
                  <User size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="Juan García"
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email</label>
                <div className={wrapCls}>
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email", e.target.value)}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className={labelCls}>WhatsApp / Teléfono</label>
                <div className={wrapCls}>
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone", e.target.value)}
                    placeholder="310 000 0000"
                    autoComplete="tel"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className={labelCls}>Contraseña</label>
                <div className={wrapCls}>
                  <Lock size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    className={inputCls}
                  />
                  <button type="button" onClick={() => setShowPass(o => !o)} className="text-gray-400 hover:text-gray-600 transition">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirmar */}
              <div>
                <label className={labelCls}>Confirmar contraseña</label>
                <div className={wrapCls}>
                  <Lock size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirm}
                    onChange={e => set("confirm", e.target.value)}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Al registrarte aceptas nuestros términos de servicio y política de privacidad.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link to="/motos/login" className="text-orange-600 font-semibold hover:text-orange-700 transition">
                Iniciar sesión
              </Link>
            </p>
          </div>

          {/* Language switch */}
          <div className="mt-5 flex justify-center">
            <div className="bg-slate-800 rounded-lg px-1 py-0.5">
              <LanguageSwitch />
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            <Link to="/motos" className="hover:text-orange-500 transition">← Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
