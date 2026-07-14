import { useEffect, useState } from "react";
import { backendBaseUrl } from "../../utils/funciones";
import Swal from "sweetalert2";
import { Pencil, Search, Trash2, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const STATUS_COLORS = {
  active:    "bg-blue-100 text-blue-700 border-blue-200",
  picked_up: "bg-purple-100 text-purple-700 border-purple-200",
  on_the_way:"bg-amber-100 text-amber-700 border-amber-200",
  delivered: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL = {
  all:       "All",
  active:    "Active",
  picked_up: "Picked up",
  on_the_way:"On the way",
  delivered: "Delivered",
  completed: "Completed",
};

const FILTERS = ["all", "active", "picked_up", "on_the_way", "delivered", "completed"];

/* ─── Edit / View Modal ──────────────────────────────── */
const EditModal = ({ load, onClose, onSaved }) => {
  const { t } = useLanguage();

  const toLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    datePickUp:        toLocal(load.datePickUp),
    companyNamePickUp: load.companyNamePickUp || "",
    addressPickup:     load.addressPickup     || "",
    cityPickUp:        load.cityPickUp        || "",
    notePickUp:        load.notePickUp        || "",
    dateDelivery:      toLocal(load.dateDelivery),
    companyDelivery:   load.companyDelivery   || "",
    addressDelivery:   load.addressDelivery   || "",
    cityDelivery:      load.cityDelivery      || "",
    noteDelivery:      load.noteDelivery      || "",
    rate:  load.rate != null ? `$${Number(load.rate).toLocaleString("en-US")}` : "",
    state: load.state || "active",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rate") {
      const digits = value.replace(/\D/g, "");
      setForm(f => ({ ...f, rate: digits ? `$${Number(digits).toLocaleString("en-US")}` : "" }));
      return;
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { datePickUp, companyNamePickUp, addressPickup, cityPickUp,
            dateDelivery, companyDelivery, addressDelivery, cityDelivery, rate } = form;
    if (!datePickUp || !companyNamePickUp || !addressPickup || !cityPickUp ||
        !dateDelivery || !companyDelivery || !addressDelivery || !cityDelivery || !rate) {
      Swal.fire({ icon: "warning", title: t("common_missing_fields"), text: t("edit_load_missing_fields"), confirmButtonColor: "#2563eb" });
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${backendBaseUrl}/load/${load._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datePickUp:        new Date(form.datePickUp).toISOString(),
          companyNamePickUp: form.companyNamePickUp,
          addressPickup:     form.addressPickup,
          cityPickUp:        form.cityPickUp,
          notePickUp:        form.notePickUp,
          dateDelivery:      new Date(form.dateDelivery).toISOString(),
          companyDelivery:   form.companyDelivery,
          addressDelivery:   form.addressDelivery,
          cityDelivery:      form.cityDelivery,
          noteDelivery:      form.noteDelivery,
          rate:  form.rate.replace(/\D/g, ""),
          state: form.state,
        }),
      });
      if (res.ok) {
        onSaved();
        Swal.fire({ icon: "success", title: t("edit_load_success_title"), text: t("edit_load_success_text"), confirmButtonColor: "#2563eb" });
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: t("edit_load_error"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const isCompleted = load.state === "completed";
    const result = await Swal.fire({
      icon: "warning",
      title: isCompleted ? "Delete this load?" : t("edit_load_cancel_title"),
      text:  isCompleted ? "This will permanently remove it from history." : t("edit_load_cancel_text"),
      showCancelButton: true,
      confirmButtonText: isCompleted ? "Delete" : t("edit_load_cancel_yes"),
      cancelButtonText:  isCompleted ? "Cancel" : t("edit_load_cancel_no"),
      confirmButtonColor: "#dc2626",
      cancelButtonColor:  "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      const url = isCompleted
        ? `${backendBaseUrl}/deleteLoad/${load._id}`
        : `${backendBaseUrl}/cancelLoad/${load._id}`;
      const res = await fetch(url, { method: "PUT" });
      if (res.ok) {
        onSaved();
        Swal.fire({ icon: "success", title: isCompleted ? "Load deleted" : t("edit_load_cancel_success_title"), timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: t("common_error"), text: t("edit_load_cancel_error"), confirmButtonColor: "#2563eb" });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    }
  };

  const inp = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{t("edit_load_title")}</h2>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mt-2">
              <span className="text-sm font-semibold text-white">
                {load.user?.name} {load.user?.lastName}
                {load.user?.unitNumber && <span className="ml-1 opacity-70">· Unit #{load.user.unitNumber}</span>}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition mt-1"><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

            {/* Status */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔄</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t("edit_load_status")}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_LABEL).filter(([k]) => k !== "all").map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setForm(f => ({ ...f, state: key }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${form.state === key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pickup */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📍</span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t("edit_load_pickup")}</span>
                <div className="flex-1 h-px bg-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>{t("edit_load_date")}</label><input type="datetime-local" name="datePickUp" value={form.datePickUp} onChange={handleChange} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_company")}</label><input type="text" name="companyNamePickUp" value={form.companyNamePickUp} onChange={handleChange} placeholder={t("edit_load_placeholder_company")} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_address")}</label><input type="text" name="addressPickup" value={form.addressPickup} onChange={handleChange} placeholder={t("edit_load_placeholder_address")} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_city")}</label><input type="text" name="cityPickUp" value={form.cityPickUp} onChange={handleChange} placeholder={t("edit_load_placeholder_city")} className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>{t("edit_load_note_pickup")}</label><textarea name="notePickUp" value={form.notePickUp} onChange={handleChange} rows={2} className={inp + " resize-none"} /></div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🚚</span>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">{t("edit_load_delivery")}</span>
                <div className="flex-1 h-px bg-cyan-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>{t("edit_load_date")}</label><input type="datetime-local" name="dateDelivery" value={form.dateDelivery} onChange={handleChange} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_company")}</label><input type="text" name="companyDelivery" value={form.companyDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_company")} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_address")}</label><input type="text" name="addressDelivery" value={form.addressDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_address")} className={inp} /></div>
                <div><label className={lbl}>{t("edit_load_city")}</label><input type="text" name="cityDelivery" value={form.cityDelivery} onChange={handleChange} placeholder={t("edit_load_placeholder_city")} className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>{t("edit_load_note_delivery")}</label><textarea name="noteDelivery" value={form.noteDelivery} onChange={handleChange} rows={2} className={inp + " resize-none"} /></div>
              </div>
            </div>

            {/* Rate */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💰</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t("edit_load_rate")}</span>
                <div className="flex-1 h-px bg-emerald-100" />
              </div>
              <div className="max-w-[200px]">
                <label className={lbl}>{t("edit_load_amount")}</label>
                <input type="text" name="rate" value={form.rate} onChange={handleChange} placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-semibold text-emerald-700" />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between gap-3 flex-shrink-0">
            <button type="button" onClick={handleDelete}
              className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
              {load.state === "completed" ? "Delete load" : t("edit_load_cancel_btn")}
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition font-medium">
                {t("edit_load_close")}
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2">
                {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? t("edit_load_saving") : t("edit_load_save")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Loads Table ────────────────────────────────────── */
export const LoadsTable = () => {
  const { t } = useLanguage();
  const [loads, setLoads]     = useState([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [editLoad, setEditLoad] = useState(null);

  const fetchLoads = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/loads`);
      const data = await res.json();
      setLoads(Array.isArray(data) ? data : []);
    } catch {
      setLoads([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchLoads(); }, []);

  const handleDeleteDirect = async (load) => {
    const isCompleted = load.state === "completed";
    const result = await Swal.fire({
      icon: "warning",
      title: isCompleted ? "Delete this load?" : t("edit_load_cancel_title"),
      text:  isCompleted ? "This will permanently remove it from history." : t("edit_load_cancel_text"),
      showCancelButton: true,
      confirmButtonText: isCompleted ? "Delete" : t("edit_load_cancel_yes"),
      cancelButtonText:  isCompleted ? "Cancel" : t("edit_load_cancel_no"),
      confirmButtonColor: "#dc2626",
      cancelButtonColor:  "#6b7280",
    });
    if (!result.isConfirmed) return;
    try {
      const url = isCompleted
        ? `${backendBaseUrl}/deleteLoad/${load._id}`
        : `${backendBaseUrl}/cancelLoad/${load._id}`;
      const res = await fetch(url, { method: "PUT" });
      if (res.ok) {
        fetchLoads();
        Swal.fire({ icon: "success", title: isCompleted ? "Load deleted" : t("edit_load_cancel_success_title"), timer: 1500, showConfirmButton: false });
      }
    } catch {
      Swal.fire({ icon: "error", title: t("common_server_error"), text: t("common_try_again"), confirmButtonColor: "#2563eb" });
    }
  };

  const fmt = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filtered = loads
    .filter(l => filter === "all" || l.state === filter)
    .filter(l => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        (l.user?.unitNumber || "").toString().toLowerCase().includes(q) ||
        (`${l.user?.name || ""} ${l.user?.lastName || ""}`).toLowerCase().includes(q) ||
        (l.cityPickUp || "").toLowerCase().includes(q) ||
        (l.cityDelivery || "").toLowerCase().includes(q) ||
        (l.companyDelivery || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return (
    <div className="flex flex-col h-full bg-gray-50">

      {/* Page header */}
      <div className="bg-white border-b px-8 py-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-900">All Loads</h2>
          <p className="text-xs text-gray-500 mt-0.5">View, edit and manage every load across all drivers</p>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
          {filtered.length} load{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b px-8 py-3 flex flex-wrap items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search unit, driver, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-60"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filter === f ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}>
              {STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {fetching ? (
          <div className="flex items-center justify-center h-40">
            <span className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-sm">No loads found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Unit</th>
                  <th className="px-5 py-3">Driver</th>
                  <th className="px-5 py-3">Pickup</th>
                  <th className="px-5 py-3">Delivery</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Rate</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(load => (
                  <tr key={load._id} className="border-b last:border-none hover:bg-gray-50 transition">
                    <td className="px-5 py-3">
                      <span className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                        #{load.user?.unitNumber ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {load.user?.name} {load.user?.lastName}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">{load.companyNamePickUp}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[140px]">{load.cityPickUp}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">{load.companyDelivery}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[140px]">{load.cityDelivery}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[load.state] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {STATUS_LABEL[load.state] || load.state}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-emerald-600">
                      {load.rate != null ? `$${Number(load.rate).toLocaleString("en-US")}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-400">{fmt(load.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setEditLoad(load)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                          title="Edit load">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDeleteDirect(load)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition border border-red-100"
                          title="Delete load">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editLoad && (
        <EditModal
          load={editLoad}
          onClose={() => setEditLoad(null)}
          onSaved={() => { setEditLoad(null); fetchLoads(); }}
        />
      )}
    </div>
  );
};
