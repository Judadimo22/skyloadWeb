import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, ShieldCheck, Trash2, Pencil, UserPlus, X } from "lucide-react";
import Swal from "sweetalert2";
import { backendBaseUrl } from "../../utils/funciones";

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
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "All fields are required", confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.password !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match", confirmButtonColor: "#2563eb" });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${backendBaseUrl}/admin`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        onClose();
        Swal.fire({ icon: "success", title: "Admin created", text: "The administrator was added successfully", confirmButtonColor: "#2563eb" })
          .then(onSuccess);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message || "Could not create the admin", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });
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
            <h2 className="text-xl font-bold text-white">Create Administrator</h2>
            <p className="text-blue-100 text-sm mt-0.5">Add a new admin to the platform</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col">
          <div className="px-6 py-5 space-y-4">

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="admin@email.com" autoComplete="off"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                  className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Edit Admin Modal ──────────────────────────────────── */

const EditAdminModal = ({ admin, onClose, onSuccess }) => {
  const [form, setForm] = useState({ email: admin.email || "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) {
      Swal.fire({ icon: "warning", title: "Email is required", confirmButtonColor: "#2563eb" });
      return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      Swal.fire({ icon: "warning", title: "Passwords do not match", confirmButtonColor: "#2563eb" });
      return;
    }
    const body = { email: form.email };
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
        Swal.fire({ icon: "success", title: "Admin updated", confirmButtonColor: "#2563eb" }).then(onSuccess);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.message || "Could not update the admin", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });
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
            <h2 className="text-xl font-bold text-white">Edit Administrator</h2>
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

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="admin@email.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-gray-400 mb-3">Leave password fields empty to keep the current password.</p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"} name="password" value={form.password}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                      onChange={handleChange} placeholder="••••••••" autoComplete="new-password"
                      className="w-full pl-9 pr-11 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
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
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

/* ─── Admins Panel ──────────────────────────────────────── */

export const AdminsPanel = ({ currentEmail }) => {
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
      title: "Delete Administrator?",
      text: `${admin.email} will lose access to the platform.`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${backendBaseUrl}/admin/${admin._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        Swal.fire({ icon: "success", title: "Admin deleted", confirmButtonColor: "#2563eb" });
        fetchAdmins();
      } else {
        const data = await res.json();
        Swal.fire({ icon: "error", title: "Error", text: data.message || "Could not delete the admin", confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Server error", text: "Please try again", confirmButtonColor: "#2563eb" });
    }
  };

  // Sort A-Z by email
  const sortedAdmins = [...admins].sort((a, b) => (a.email || "").localeCompare(b.email || ""));

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
            <h2 className="text-lg font-bold text-gray-900">Administrators</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage who can access the admin platform</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <UserPlus size={16} />
            New Admin
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span className="text-sm">Loading admins...</span>
          </div>
        ) : sortedAdmins.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No administrators found</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAdmins.map((admin) => {
                const isSelf = admin.email === currentEmail;
                return (
                  <tr key={admin._id} className="border-b last:border-none hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                          {admin.email}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] text-gray-400 italic">(you)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditAdmin(admin)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(admin)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};
