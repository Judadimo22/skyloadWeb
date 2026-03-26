import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Truck, User, UserPlus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/actions/adminActions";
import { registerUser } from "../../redux/actions/usersActions";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";

/* ─── Assign Load Modal ─────────────────────────────── */

const EMPTY_FORM = {
  datePickUp: "",
  companyNamePickUp: "",
  addressPickup: "",
  cityPickUp: "",
  dateDelivery: "",
  companyDelivery: "",
  addressDelivery: "",
  cityDelivery: "",
  rate: "",
};

const AssignLoadModal = ({ user, onClose, onSuccess }) => {

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rate") {
      const digits = value.replace(/\D/g, "");
      const formatted = digits ? `$${Number(digits).toLocaleString("en-US")}` : "";
      setForm(f => ({ ...f, rate: formatted }));
      return;
    }

    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const { datePickUp, companyNamePickUp, addressPickup, cityPickUp,
            dateDelivery, companyDelivery, addressDelivery, cityDelivery, rate } = form;

    if (!datePickUp || !companyNamePickUp || !addressPickup || !cityPickUp ||
        !dateDelivery || !companyDelivery || !addressDelivery || !cityDelivery || !rate) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "All fields are required", confirmButtonColor: "#2563eb" });
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(`${backendBaseUrl}/asignLoad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datePickUp, companyNamePickUp, addressPickup, cityPickUp,
          dateDelivery, companyDelivery, addressDelivery, cityDelivery,
          rate: rate.replace(/\D/g, ""),
          user: user._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
        Swal.fire({
          icon: "success",
          title: "Load created",
          text: "The load was assigned successfully",
          confirmButtonColor: "#2563eb",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message || "The load could not be created", confirmButtonColor: "#2563eb" });
      }

    } catch {

      Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });

    } finally {

      setLoading(false);

    }

  };

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Assign Load</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-2">
              <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs">👤</div>
              <span className="text-sm font-semibold text-white">{user.name} {user.lastName}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">

          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* Pickup section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📍</span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Pickup</span>
                <div className="flex-1 h-px bg-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" name="datePickUp" value={form.datePickUp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input type="text" name="companyNamePickUp" value={form.companyNamePickUp} onChange={handleChange} placeholder="Company name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input type="text" name="addressPickup" value={form.addressPickup} onChange={handleChange} placeholder="Street address" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" name="cityPickUp" value={form.cityPickUp} onChange={handleChange} placeholder="City" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Delivery section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🚚</span>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Delivery</span>
                <div className="flex-1 h-px bg-cyan-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" name="dateDelivery" value={form.dateDelivery} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Company</label>
                  <input type="text" name="companyDelivery" value={form.companyDelivery} onChange={handleChange} placeholder="Company name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Address</label>
                  <input type="text" name="addressDelivery" value={form.addressDelivery} onChange={handleChange} placeholder="Street address" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" name="cityDelivery" value={form.cityDelivery} onChange={handleChange} placeholder="City" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Rate section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💰</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Rate</span>
                <div className="flex-1 h-px bg-emerald-100" />
              </div>
              <div className="max-w-[200px]">
                <label className={labelClass}>Amount</label>
                <input
                  type="text"
                  name="rate"
                  value={form.rate}
                  onChange={handleChange}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-semibold text-emerald-700"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Creating..." : "Create Load"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );

};

/* ─── Register Driver Modal ─────────────────────────── */

const EMPTY_REGISTER = { name: "", lastName: "", email: "", password: "", vehicle: "" };

const RegisterDriverModal = ({ onClose, onSuccess }) => {

  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.lastName || !form.email || !form.password) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "All fields are required", confirmButtonColor: "#2563eb" });
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(registerUser(form.email, form.password, form.name, form.lastName, form.vehicle));

      if (result.token) {
        onClose();
        Swal.fire({ icon: "success", title: "Driver registered", text: "The driver was added to your fleet", confirmButtonColor: "#2563eb" })
          .then(() => onSuccess?.());
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "An error occurred while creating the user", confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">Register Driver</h2>
            <p className="text-blue-100 text-sm mt-0.5">Add a new driver to your fleet</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 space-y-4">

            {/* Name row */}
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

            {/* Vehicle */}
            <div>
              <label className={labelClass}>Vehicle / Unit ID</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicle" value={form.vehicle} onChange={handleChange} placeholder="e.g. Unit 5607" className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="driver@email.com" className={inputClass} />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Registering..." : "Register Driver"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );

};

/* ─── Users List ─────────────────────────────────────── */

export const UsersList = () => {

  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [assignUser, setAssignUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try { await dispatch(getUsers()); }
      catch (error) { console.log("Error fetching users:", error); }
    };
    fetchData();
  }, [dispatch]);

  return (

    <div className="space-y-6 border-2 shadow-md border-[#0066f9] rounded-lg">

      {assignUser && (
        <AssignLoadModal
          user={assignUser}
          onClose={() => setAssignUser(null)}
        />
      )}

      {showRegister && (
        <RegisterDriverModal
          onClose={() => setShowRegister(false)}
          onSuccess={() => dispatch(getUsers())}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 pt-5">
        <h2 className="text-xl font-semibold text-gray-800">Drivers</h2>
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <UserPlus size={16} />
          Register Driver
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded-b-xl overflow-hidden border-t">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.lastName}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                    {user.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setAssignUser(user)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-xs font-semibold"
                  >
                    Assign Load
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

  );

};
