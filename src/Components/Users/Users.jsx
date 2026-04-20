import { useEffect, useState } from "react";
import { Eye, EyeOff, Link, Mail, Pencil, Trash2, Truck, User, UserPlus, X, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/actions/adminActions";
import { registerUser } from "../../redux/actions/usersActions";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";
import { useLanguage } from "../../context/LanguageContext";

/* ─── Assign Load Modal ─────────────────────────────── */

const EMPTY_FORM = {
  datePickUp: "",
  companyNamePickUp: "",
  addressPickup: "",
  cityPickUp: "",
  notePickUp: "",
  dateDelivery: "",
  companyDelivery: "",
  addressDelivery: "",
  cityDelivery: "",
  noteDelivery: "",
  rate: "",
};

const AssignLoadModal = ({ user, onClose, onSuccess }) => {
  const { t } = useLanguage();
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
      Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("assign_load_error_missing"), confirmButtonColor: "#2563eb" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${backendBaseUrl}/asignLoad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datePickUp: new Date(datePickUp).toISOString(),
          companyNamePickUp, addressPickup, cityPickUp,
          notePickUp: form.notePickUp,
          dateDelivery: new Date(dateDelivery).toISOString(),
          companyDelivery, addressDelivery, cityDelivery,
          noteDelivery: form.noteDelivery,
          rate: rate.replace(/\D/g, ""),
          user: user._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onClose();
        Swal.fire({
          icon: "success",
          title: t("assign_load_success_title"),
          text: t("assign_load_success_text"),
          confirmButtonColor: "#2563eb",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("assign_load_error_failed"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
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
            <h2 className="text-xl font-bold text-white">{t("assign_load_title")}</h2>
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
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t("assign_load_pickup")}</span>
                <div className="flex-1 h-px bg-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("assign_load_date")}</label>
                  <input type="datetime-local" name="datePickUp" value={form.datePickUp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_company")}</label>
                  <input type="text" name="companyNamePickUp" value={form.companyNamePickUp} onChange={handleChange} placeholder={t("assign_load_placeholder_company")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_address")}</label>
                  <input type="text" name="addressPickup" value={form.addressPickup} onChange={handleChange} placeholder={t("assign_load_placeholder_address")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_city")}</label>
                  <input type="text" name="cityPickUp" value={form.cityPickUp} onChange={handleChange} placeholder={t("assign_load_placeholder_city")} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{t("assign_load_note_pickup")}</label>
                  <textarea name="notePickUp" value={form.notePickUp} onChange={handleChange} placeholder={t("assign_load_placeholder_pickup_notes")} rows={2} className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>

            {/* Delivery section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🚚</span>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{t("assign_load_delivery")}</span>
                <div className="flex-1 h-px bg-cyan-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{t("assign_load_date")}</label>
                  <input type="datetime-local" name="dateDelivery" value={form.dateDelivery} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_company")}</label>
                  <input type="text" name="companyDelivery" value={form.companyDelivery} onChange={handleChange} placeholder={t("assign_load_placeholder_company")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_address")}</label>
                  <input type="text" name="addressDelivery" value={form.addressDelivery} onChange={handleChange} placeholder={t("assign_load_placeholder_address")} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t("assign_load_city")}</label>
                  <input type="text" name="cityDelivery" value={form.cityDelivery} onChange={handleChange} placeholder={t("assign_load_placeholder_city")} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{t("assign_load_note_delivery")}</label>
                  <textarea name="noteDelivery" value={form.noteDelivery} onChange={handleChange} placeholder={t("assign_load_placeholder_delivery_notes")} rows={2} className={inputClass + " resize-none"} />
                </div>
              </div>
            </div>

            {/* Rate section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💰</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t("assign_load_rate")}</span>
                <div className="flex-1 h-px bg-emerald-100" />
              </div>
              <div className="max-w-[200px]">
                <label className={labelClass}>{t("assign_load_amount")}</label>
                <input
                  type="text" name="rate" value={form.rate} onChange={handleChange} placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-semibold text-emerald-700"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              {t("assign_load_cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t("assign_load_submitting") : t("assign_load_submit")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Register Driver Modal ─────────────────────────── */

const EMPTY_REGISTER = { name: "", lastName: "", email: "", password: "", vehicle: "", vehicleDimension: "", unitNumber: "", confirmPassword: "" };

const RegisterDriverModal = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.lastName || !form.email || !form.password || !form.vehicleDimension || !form.unitNumber || !form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("register_driver_error_missing"), confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("register_driver_error_password"), confirmButtonColor: "#2563eb" });
      return;
    }
    try {
      setLoading(true);
      const result = await dispatch(registerUser(form.email, form.password, form.name, form.lastName, form.vehicle, form.vehicleDimension, form.unitNumber));
      if (result.token) {
        onClose();
        Swal.fire({ icon: "success", title: t("register_driver_success_title"), text: t("register_driver_success_text"), confirmButtonColor: "#2563eb" })
          .then(() => onSuccess?.());
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_error"), text: t("register_driver_error_failed"), confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("register_driver_title")}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{t("register_driver_subtitle")}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col">
          <div className="px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("register_driver_first_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("register_driver_last_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_vehicle")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicle" value={form.vehicle} onChange={handleChange} placeholder="" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_dimensions")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicleDimension" value={form.vehicleDimension} onChange={handleChange} placeholder="" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_unit")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="unitNumber" value={form.unitNumber} onChange={handleChange} placeholder="" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_email")}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="driver@email.com" autoComplete="off" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_password")}</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_confirm_password")}</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              {t("register_driver_cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t("register_driver_submitting") : t("register_driver_submit")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Edit Driver Modal ──────────────────────────────── */

const EditDriverModal = ({ user, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    vehicle: user.vehicle || "",
    vehicleDimension: user.vehicleDimension || "",
    unitNumber: user.unitNumber || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.lastName || !form.email || !form.unitNumber) {
      Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("edit_driver_error_missing"), confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("register_driver_error_password"), confirmButtonColor: "#2563eb" });
      return;
    }
    try {
      setLoading(true);
      const body = {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        vehicle: form.vehicle,
        vehicleDimension: form.vehicleDimension,
        unitNumber: form.unitNumber,
      };
      if (form.newPassword) body.newPassword = form.newPassword;

      const res = await fetch(`${backendBaseUrl}/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onClose();
        Swal.fire({ icon: "success", title: t("edit_driver_success_title"), text: t("edit_driver_success_text"), confirmButtonColor: "#2563eb" })
          .then(() => onSuccess?.());
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("edit_driver_error_failed"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("edit_driver_title")}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{t("edit_driver_subtitle")}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("register_driver_first_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("register_driver_last_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_vehicle")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicle" value={form.vehicle} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_dimensions")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="vehicleDimension" value={form.vehicleDimension} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_unit")}</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="unitNumber" value={form.unitNumber} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("register_driver_email")}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="off" className={inputClass} />
              </div>
            </div>

            {/* Password section */}
            <div className="pt-1 border-t">
              <p className="text-xs text-gray-400 mb-3 mt-2">{t("edit_driver_password_hint")}</p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>{t("edit_driver_new_password")}</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"} name="newPassword" value={form.newPassword}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t("edit_driver_confirm_new_password")}</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              {t("edit_driver_cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t("edit_driver_submitting") : t("edit_driver_submit")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── View Driver Modal ──────────────────────────────── */

const ViewDriverModal = ({ user, onClose, onEdit }) => {
  const { t } = useLanguage();

  const Row = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-none">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-blue-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-800 break-all">{value || <span className="text-gray-300 italic">—</span>}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("view_driver_title")}</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-2">
              <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                <User size={11} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-white">{user.name} {user.lastName}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="px-6 py-2 overflow-y-auto flex-1">
          <Row label={t("register_driver_first_name")} value={user.name} icon={User} />
          <Row label={t("register_driver_last_name")} value={user.lastName} icon={User} />
          <Row label={t("register_driver_unit")} value={user.unitNumber ? `#${user.unitNumber}` : null} icon={Truck} />
          <Row label={t("register_driver_vehicle")} value={user.vehicle} icon={Truck} />
          <Row label={t("register_driver_dimensions")} value={user.vehicleDimension} icon={Truck} />
          <Row label={t("register_driver_email")} value={user.email} icon={Mail} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
            {t("common_cancel")}
          </button>
          <button
            type="button"
            onClick={() => { onClose(); onEdit(user); }}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Pencil size={14} />
            {t("edit_driver_title")}
          </button>
        </div>

      </div>
    </div>
  );
};

/* ─── Users List ─────────────────────────────────────── */

export const UsersList = ({ unitFilter = "" }) => {
  const { t } = useLanguage();
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [assignUser, setAssignUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [editDriver, setEditDriver] = useState(null);
  const [viewDriver, setViewDriver] = useState(null);

  const filteredUsers = users
    .filter((user) =>
      user.unitNumber?.toString().toLowerCase().includes(unitFilter.toLowerCase())
    )
    .sort((a, b) =>
      (a.unitNumber || "").toString().localeCompare((b.unitNumber || "").toString(), undefined, { numeric: true })
    );

  useEffect(() => {
    const fetchData = async () => {
      try { await dispatch(getUsers()); }
      catch (error) { console.log("Error fetching users:", error); }
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      icon: "warning",
      title: t("delete_driver_title"),
      text: `${user.name} ${user.lastName} ${t("delete_driver_text")}`,
      showCancelButton: true,
      confirmButtonText: t("delete_driver_confirm"),
      cancelButtonText: t("delete_driver_cancel"),
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${backendBaseUrl}/user/${user._id}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire({ icon: "success", title: t("delete_driver_success"), confirmButtonColor: "#2563eb", timer: 2000, showConfirmButton: false });
        dispatch(getUsers());
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: t("delete_driver_error"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    }
  };

  return (
    <div className="space-y-6 border border-gray-600 shadow-md rounded-lg">

      {assignUser && (
        <AssignLoadModal user={assignUser} onClose={() => setAssignUser(null)} />
      )}

      {showRegister && (
        <RegisterDriverModal onClose={() => setShowRegister(false)} onSuccess={() => dispatch(getUsers())} />
      )}

      {editDriver && (
        <EditDriverModal
          user={editDriver}
          onClose={() => setEditDriver(null)}
          onSuccess={() => { setEditDriver(null); dispatch(getUsers()); }}
        />
      )}

      {viewDriver && (
        <ViewDriverModal
          user={viewDriver}
          onClose={() => setViewDriver(null)}
          onEdit={(u) => setEditDriver(u)}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center px-5 pt-5">
        <h2 className="text-xl font-semibold text-gray-800">{t("drivers_title")}</h2>
        <button
          onClick={() => setShowRegister(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <UserPlus size={16} />
          {t("drivers_register")}
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-sm rounded-b-xl overflow-hidden border-t">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-6 py-3">{t("drivers_col_first_name")}</th>
              <th className="px-6 py-3">{t("drivers_col_last_name")}</th>
              <th className="px-6 py-3">{t("drivers_col_unit")}</th>
              <th className="px-6 py-3">{t("drivers_col_email")}</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b last:border-none hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.lastName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                      #{user.unitNumber ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                      {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Assign Load */}
                      <button
                        onClick={() => setAssignUser(user)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-xs font-semibold"
                      >
                        {t("drivers_assign_load")}
                      </button>
                      {/* Track Link */}
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/track/${user._id}`;
                          navigator.clipboard.writeText(url).then(() => {
                            Swal.fire({
                              icon: "success",
                              title: t("link_copied_title"),
                              text: t("link_copied_text"),
                              confirmButtonColor: "#2563eb",
                              timer: 2500,
                              showConfirmButton: false,
                            });
                          });
                        }}
                        className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition text-xs font-semibold border border-gray-200"
                        title="Copy tracking link"
                      >
                        <Link size={12} />
                        {t("drivers_track")}
                      </button>
                      {/* View */}
                      <button
                        onClick={() => setViewDriver(user)}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition border border-gray-200"
                        title={t("view_driver_title")}
                      >
                        <Info size={14} />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => setEditDriver(user)}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                        title={t("edit_driver_title")}
                      >
                        <Pencil size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition border border-red-100"
                        title={t("delete_driver_title")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  {t("drivers_no_match")} <span className="font-semibold text-gray-600">"{unitFilter}"</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
