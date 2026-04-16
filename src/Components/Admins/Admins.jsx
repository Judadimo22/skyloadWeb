import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, ShieldCheck, Trash2, Pencil, UserPlus, X, User } from "lucide-react";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";
import { useLanguage } from "../../context/LanguageContext";

/* ─── helpers ──────────────────────────────────────────── */

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("loginToken") || ""}`,
});

/* ─── Create Admin Modal ────────────────────────────────── */

const CreateAdminModal = ({ onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("create_admin_error_missing"), confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("create_admin_error_password"), confirmButtonColor: "#2563eb" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${backendBaseUrl}/admin`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name, lastName: form.lastName }),
      });
      const data = await res.json();
      if (res.ok) {
        onClose();
        Swal.fire({ icon: "success", title: t("create_admin_success_title"), text: t("create_admin_success_text"), confirmButtonColor: "#2563eb" })
          .then(onSuccess);
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("create_admin_error_failed"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("create_admin_title")}</h2>
            <p className="text-blue-100 text-sm mt-0.5">{t("create_admin_subtitle")}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col">
          <div className="px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("create_admin_first_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("create_admin_last_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("create_admin_email")}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@email.com" autoComplete="off"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("create_admin_password")}</label>
              <div className="relative">
                <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("create_admin_confirm_password")}</label>
              <div className="relative">
                <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              {t("create_admin_cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t("create_admin_submitting") : t("create_admin_submit")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Edit Admin Modal ──────────────────────────────────── */

const EditAdminModal = ({ admin, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: admin.name || "",
    lastName: admin.lastName || "",
    email: admin.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      Swal.fire({ icon: "warning", title: t("edit_admin_error_email"), confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: t("edit_admin_error_password"), confirmButtonColor: "#2563eb" });
      return;
    }
    const body = { email: form.email, name: form.name, lastName: form.lastName };
    if (form.password) body.password = form.password;

    try {
      setLoading(true);
      const res = await fetch(`${backendBaseUrl}/admin/${admin._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onClose();
        Swal.fire({ icon: "success", title: t("edit_admin_success_title"), confirmButtonColor: "#2563eb" }).then(onSuccess);
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("edit_admin_error_failed"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("edit_admin_title")}</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-2">
              <div className="w-5 h-5 bg-white/30 rounded-full flex items-center justify-center text-xs">👤</div>
              <span className="text-sm font-semibold text-white">{admin.email}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col">
          <div className="px-6 py-5 space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>{t("create_admin_first_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>
              <div>
                <label className={labelClass}>{t("create_admin_last_name")}</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("create_admin_email")}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-gray-400 mb-3">{t("edit_admin_password_hint")}</p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>{t("edit_admin_new_password")}</label>
                  <div className="relative">
                    <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="password" value={form.password}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t("edit_admin_confirm_new_password")}</label>
                  <div className="relative">
                    <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              {t("edit_admin_cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? t("edit_admin_submitting") : t("edit_admin_submit")}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Admins Panel ──────────────────────────────────────── */

export const AdminsPanel = ({ currentEmail }) => {
  const { t } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/admins`, { headers: authHeaders() });
      const data = await res.json();
      if (res.ok) setAdmins(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (admin) => {
    const result = await Swal.fire({
      icon: "warning",
      title: t("delete_admin_title"),
      text: `${admin.email} ${t("delete_admin_text")}`,
      showCancelButton: true,
      confirmButtonText: t("delete_admin_confirm"),
      cancelButtonText: t("delete_admin_cancel"),
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${backendBaseUrl}/deleteAdmin/${admin._id}`, {
        method: "POST",
        headers: authHeaders(),
      });
      if (res.ok) {
        Swal.fire({ icon: "success", title: t("delete_admin_success"), confirmButtonColor: "#2563eb" });
        fetchAdmins();
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: t("common_error"), text: data.message || t("delete_admin_error"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    }
  };

  const SUPERADMIN_EMAILS = import.meta.env.VITE_SUPERADMIN_EMAILS?.split(",") ?? [];

  const superAdmins = admins
    .filter(a => SUPERADMIN_EMAILS.includes(a.email))
    .sort((a, b) => (a.email || "").localeCompare(b.email || ""));

  const regularAdmins = admins
    .filter(a => !SUPERADMIN_EMAILS.includes(a.email))
    .sort((a, b) => (a.email || "").localeCompare(b.email || ""));

  const sortedAdmins = [...superAdmins, ...regularAdmins];

  return (
    <div className="space-y-6">

      {showCreate && (
        <CreateAdminModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchAdmins(); }}
        />
      )}

      {editAdmin && (
        <EditAdminModal
          admin={editAdmin}
          onClose={() => setEditAdmin(null)}
          onSuccess={() => { setEditAdmin(null); fetchAdmins(); }}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t("admins_title")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{t("admins_subtitle")}</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <UserPlus size={16} />
            {t("admins_new")}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-sm">{t("admins_loading")}</span>
          </div>
        ) : sortedAdmins.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t("admins_none")}</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3">{t("admins_col_name")}</th>
                <th className="px-6 py-3">{t("admins_col_email")}</th>
                <th className="px-6 py-3">{t("admins_col_role")}</th>
                <th className="px-6 py-3 text-right">{t("admins_col_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedAdmins.map((admin, index) => {
                const isSelf = admin.email === currentEmail;
                const isSuperAdmin = SUPERADMIN_EMAILS.includes(admin.email);
                const fullName = [admin.name, admin.lastName].filter(Boolean).join(" ");
                const isFirstSuperAdmin = index === 0;
                const isFirstRegularAdmin = index === superAdmins.length && regularAdmins.length > 0;
                return (
                  <>
                    {isFirstSuperAdmin && (
                      <tr key="header-super">
                        <td colSpan={4} className="px-6 pt-4 pb-1">
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{t("admins_section_super")}</span>
                        </td>
                      </tr>
                    )}
                    {isFirstRegularAdmin && (
                      <tr key="header-admin">
                        <td colSpan={4} className="px-6 pt-5 pb-1 border-t-2 border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t("admins_section_regular")}</span>
                        </td>
                      </tr>
                    )}
                    <tr key={admin._id} className="border-b last:border-none hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {fullName ? (
                          <span className="text-sm font-medium text-gray-800">{fullName}</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                            {admin.email}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] text-gray-400 italic">{t("admins_you")}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isSuperAdmin ? (
                          <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                            {t("role_super_admin")}
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                            {t("role_admin")}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditAdmin(admin)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                          >
                            <Pencil size={12} />
                            {t("admins_edit")}
                          </button>
                          {!isSelf && (
                            <button
                              onClick={() => handleDelete(admin)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition"
                            >
                              <Trash2 size={12} />
                              {t("admins_delete")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};
