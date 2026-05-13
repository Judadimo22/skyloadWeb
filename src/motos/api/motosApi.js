import { backendBaseUrl } from "../../utils/funciones";

const BASE = `${backendBaseUrl}/motos`;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("motosToken") || ""}`,
});

/* ── Auth ───────────────────────────────────────── */
export const apiRegister = (body) =>
  fetch(`${BASE}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());

export const apiLogin = (body) =>
  fetch(`${BASE}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());

/* ── Public listings ────────────────────────────── */
export const apiGetListings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return fetch(`${BASE}/listings${qs ? `?${qs}` : ""}`).then(r => r.json());
};

export const apiGetListing = (id) =>
  fetch(`${BASE}/listings/${id}`).then(r => r.json());

/* ── User listings (auth) ───────────────────────── */
export const apiGetMyListings = () =>
  fetch(`${BASE}/listings/mine`, { headers: authHeaders() }).then(r => r.json());

export const apiCreateListing = (body) =>
  fetch(`${BASE}/listings`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json());

export const apiUpdateListing = (id, body) =>
  fetch(`${BASE}/listings/${id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json());

export const apiDeleteListing = (id) =>
  fetch(`${BASE}/listings/${id}`, { method: "DELETE", headers: authHeaders() }).then(r => r.json());

export const apiPayListing = (id, plan) =>
  fetch(`${BASE}/listings/${id}/pay`, { method: "POST", headers: authHeaders(), body: JSON.stringify({ plan }) }).then(r => r.json());

/* ── Admin ──────────────────────────────────────── */
export const apiAdminGetListings = () =>
  fetch(`${BASE}/admin/listings`, { headers: authHeaders() }).then(r => r.json());

export const apiAdminApprove = (id) =>
  fetch(`${BASE}/admin/listings/${id}/approve`, { method: "PUT", headers: authHeaders() }).then(r => r.json());

export const apiAdminReject = (id, body = {}) =>
  fetch(`${BASE}/admin/listings/${id}/reject`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) }).then(r => r.json());

export const apiAdminDelete = (id) =>
  fetch(`${BASE}/admin/listings/${id}`, { method: "DELETE", headers: authHeaders() }).then(r => r.json());

/* ── Constants ──────────────────────────────────── */
export const MOTO_TYPES = ["Deportiva", "Naked", "Scooter", "Touring", "Enduro", "Custom", "Eléctrica", "Otro"];
export const MOTO_BRANDS = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "KTM", "Royal Enfield", "BMW", "Harley-Davidson", "AKT", "Auteco", "Bajaj", "TVS", "Hero", "Benelli", "Italika", "Otro"];
export const CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Manizales", "Ibagué", "Cúcuta", "Villavicencio", "Pasto", "Santa Marta", "Armenia", "Neiva", "Otra"];
export const PLANS = {
  basica: { label: "Básica", price: 0, description: "Aparece en resultados normales", days: 30 },
  destacada: { label: "Destacada", price: 19900, description: "Aparece al inicio con badge especial", days: 30 },
};
