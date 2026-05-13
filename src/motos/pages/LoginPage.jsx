import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Bike, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { apiLogin } from "../api/motosApi";
import { useMotos } from "../context/MotosContext";
import { LanguageSwitch } from "../../Components/LanguageSwitch";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { motosLogin } = useMotos();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Completa todos los campos.");
    setError("");
    setLoading(true);
    try {
      const res = await apiLogin({ email: form.email.trim().toLowerCase(), password: form.password });
      if (res.token) {
        motosLogin(res.token);
        navigate("/motos/panel");
      } else {
        setError(res.message || "Email o contraseña incorrectos.");
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
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Iniciar sesión</h1>
            <p className="text-sm text-gray-400 mb-7">Accede a tu cuenta para gestionar tus anuncios</p>

            {error && (
              <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-orange-400 transition">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="tu@email.com" autoComplete="email"
                    className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Contraseña</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-orange-400 transition">
                  <Lock size={16} className="text-gray-400 flex-shrink-0" />
                  <input
                    type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                    placeholder="••••••••" autoComplete="current-password"
                    className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-300"
                  />
                  <button type="button" onClick={() => setShowPass(o => !o)} className="text-gray-400 hover:text-gray-600 transition">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              ¿No tienes cuenta?{" "}
              <Link to="/motos/registro" className="text-orange-600 font-semibold hover:text-orange-700 transition">
                Regístrate gratis
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
