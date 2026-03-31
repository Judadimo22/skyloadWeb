import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../redux/actions/adminActions";
import { AlertCircle, Eye, EyeOff, Mail, MapPin, Package, Truck, Users } from "lucide-react";
import  logoSencillo  from '../../assets/logoApp.png'

const FEATURES = [
  { icon: MapPin,   text: "Live GPS tracking for all drivers" },
  { icon: Truck,    text: "Assign and manage loads in seconds" },
  { icon: Package,  text: "Real-time shipment status updates" },
  { icon: Users,    text: "Full driver management dashboard" },
];

export default function Login() {

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [form, setForm]               = useState({ email: "", password: "" });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(loginAdmin(form.email, form.password));
      if (result.status) navigate("/home");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">

        {/* Decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-500/8 rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 right-20 w-64 h-64 bg-blue-700/10 rounded-full pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-25 h-25 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 px-2">
          <img src="" alt="" />
          <img src={logoSencillo} alt="" />
            <Truck size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Fleet Point 360 Admin</span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-widest">Fleet Point 360 Platform</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Fleet Point 360<br />
            <span className="text-blue-400">management</span>
          </h1>

          <p className="text-slate-400 text-base mb-10 leading-relaxed max-w-sm">
            Monitor your drivers, assign loads, and track shipments — all in one place.
          </p>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-slate-600 text-xs relative z-10">
          © {new Date().getFullYear()} Skyload. All rights reserved.
        </p>

      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">Skyload Admin</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@skyload.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1 shadow-md shadow-blue-600/20"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-xs text-center text-gray-400 mt-8">
            © {new Date().getFullYear()} Skyload · Admin Panel
          </p>

        </div>
      </div>

    </div>
  );
}
