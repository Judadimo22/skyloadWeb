import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/actions/usersActions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { ArrowLeft, Eye, EyeOff, Mail, Truck, User } from "lucide-react";

export const RegisterUser = () => {

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);

  const [form, setForm] = useState({
    name: "", lastName: "", email: "", password: "", vehicle: "", vehicleDimensions: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.lastName || !form.email || !form.password || !form.vehicleDimensions) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "All fields are required", confirmButtonColor: "#2563eb" });
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(registerUser(form.email, form.password, form.name, form.lastName, form.vehicle, form.vehicleDimensions));

      if (result.token) {
        await Swal.fire({ icon: "success", title: "Driver registered", text: "The driver was added to your fleet", confirmButtonColor: "#2563eb" });
        navigate("/home");
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "An error occurred while creating the user", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-blue-200 hover:text-white text-xs font-medium mb-5 transition"
          >
            <ArrowLeft size={14} />
            Back to panel
          </button>
          <h2 className="text-2xl font-bold text-white">Register Driver</h2>
          <p className="text-blue-200 text-sm mt-1">Add a new driver to your fleet</p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Vehicle / Unit ID</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicle" value={form.vehicle} onChange={handleChange} placeholder="e.g. Unit 5607" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Vehicle Dimensions</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicle" value={form.vehicleDimensions} onChange={handleChange} placeholder="e.g. Unit 5607" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="driver@email.com" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
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
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
              >
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Registering..." : "Register Driver"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );

};
