import { useState } from "react";
import { X, Star, Zap, CreditCard, Check } from "lucide-react";
import { PLANS, apiPayListing } from "../api/motosApi";
import Swal from "sweetalert2";

export const PaymentModal = ({ listingId, currentPlan, onClose, onSuccess }) => {
  const [selected, setSelected] = useState(currentPlan || "basica");
  const [step, setStep] = useState("select"); // "select" | "pay"
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);

  const handlePlanContinue = () => {
    if (selected === "basica") {
      handlePay();
    } else {
      setStep("pay");
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await apiPayListing(listingId, selected);
      if (res._id || res.ok) {
        onSuccess?.(selected);
        Swal.fire({ icon: "success", title: "¡Listo!", text: selected === "destacada" ? "Tu moto fue marcada como Destacada" : "Tu moto está activa", confirmButtonColor: "#f97316", timer: 2500, showConfirmButton: false });
        onClose();
      } else {
        Swal.fire({ icon: "error", title: "Error", text: res.message || "No se pudo procesar el pago", confirmButtonColor: "#f97316" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Intenta de nuevo más tarde", confirmButtonColor: "#f97316" });
    } finally {
      setLoading(false);
    }
  };

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">Elige tu plan</h2>
            <p className="text-orange-100 text-sm mt-0.5">Publica tu moto y llega a más compradores</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition"><X size={20} /></button>
        </div>

        <div className="p-6">
          {step === "select" ? (
            <>
              {/* Plan cards */}
              <div className="space-y-3 mb-5">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selected === key
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selected === key ? "bg-orange-500" : "bg-gray-100"}`}>
                          {key === "destacada" ? <Star size={14} className={selected === key ? "text-white" : "text-gray-400"} /> : <Zap size={14} className={selected === key ? "text-white" : "text-gray-400"} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{plan.label}</p>
                          <p className="text-xs text-gray-500">{plan.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {plan.price === 0 ? (
                          <p className="font-bold text-green-600">Gratis</p>
                        ) : (
                          <p className="font-bold text-orange-600">${plan.price.toLocaleString("es-CO")}</p>
                        )}
                        <p className="text-[10px] text-gray-400">{plan.days} días</p>
                      </div>
                    </div>
                    {key === "destacada" && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {["Aparece primero", "Badge especial", "Más visibilidad"].map(f => (
                          <span key={f} className="flex items-center gap-1 text-[10px] text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                            <Check size={9} /> {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handlePlanContinue}
                disabled={loading}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-60"
              >
                {selected === "basica" ? "Publicar gratis" : "Continuar al pago"}
              </button>
            </>
          ) : (
            <>
              {/* Payment form */}
              <div className="mb-4 p-3 bg-orange-50 rounded-xl text-sm text-orange-700 font-medium flex items-center gap-2">
                <CreditCard size={15} /> Pago seguro — Plan Destacada ${PLANS.destacada.price.toLocaleString("es-CO")}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Número de tarjeta</label>
                  <input
                    type="text" value={card.number} maxLength={19}
                    onChange={(e) => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nombre en la tarjeta</label>
                  <input
                    type="text" value={card.name}
                    onChange={(e) => setCard(c => ({ ...c, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Vencimiento</label>
                    <input
                      type="text" value={card.expiry} maxLength={5}
                      onChange={(e) => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">CVV</label>
                    <input
                      type="text" value={card.cvv} maxLength={4}
                      onChange={(e) => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                      placeholder="123"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep("select")} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
                  Atrás
                </button>
                <button
                  onClick={handlePay}
                  disabled={loading || !card.number || !card.name || !card.expiry || !card.cvv}
                  className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? "Procesando..." : `Pagar $${PLANS.destacada.price.toLocaleString("es-CO")}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
