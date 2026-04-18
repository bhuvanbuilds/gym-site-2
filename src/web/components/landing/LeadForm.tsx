import { useState } from "react";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone || !form.goal) {
      setError("Fill in all fields.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          goal: form.goal,
        }),
      });
      const d = await res.json();
      if (res.ok) setSuccess(true);
      else setError(d.error || "Something went wrong.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="lead-form"
      className="py-24 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#E8FF00]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="reveal-left">
            <div className="section-label mb-4">Free Trial</div>
            <h2 className="display text-[clamp(48px,7vw,88px)] text-white leading-none mb-6">
              BOOK YOUR
              <br />
              <span className="text-[#E8FF00]">FREE</span>
              <br />
              TRIAL
            </h2>
            <p className="text-[#666] text-base leading-relaxed mb-8 max-w-sm">
              Fill in your details and we'll reach out within 2 hours — no
              commitment, no card needed.
            </p>

            {/* Trust signals */}
            <div className="space-y-3">
              {[
                "No credit card required",
                "We'll call/WhatsApp within 2 hours",
                "Cancel anytime, no questions asked",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 text-sm text-[#666]"
                >
                  <div className="w-4 h-4 rounded-full bg-[#E8FF00]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4L3.5 6L6.5 2"
                        stroke="#E8FF00"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="reveal-right">
            <div className="surface p-8 md:p-10">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#E8FF00]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path
                        d="M5 14L11 20L23 8"
                        stroke="#E8FF00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="display-upright text-3xl text-white mb-2">
                    You're In!
                  </div>
                  <p className="text-[#666] text-sm mb-6">
                    We'll contact you within 2 hours on WhatsApp.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({ name: "", phone: "", goal: "" });
                    }}
                    className="text-[#E8FF00] text-sm hover:underline"
                  >
                    Submit another →
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div>
                    <label className="block text-[#666] text-xs uppercase tracking-widest font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="field"
                    />
                  </div>
                  <div>
                    <label className="block text-[#666] text-[10px] uppercase tracking-[0.16em] font-semibold mb-2.5">
                      WhatsApp Number
                    </label>
                    <div className="flex gap-2.5">
                      <div className="field !w-auto shrink-0 flex items-center justify-center text-white/40 text-sm px-4 bg-white/[0.03]">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          })
                        }
                        className="field flex-1"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#666] text-xs uppercase tracking-widest font-semibold mb-2">
                      Your Goal
                    </label>
                    <select
                      value={form.goal}
                      onChange={(e) =>
                        setForm({ ...form, goal: e.target.value })
                      }
                      className="field"
                    >
                      <option value="">Select a goal</option>
                      <option value="weight_loss">🔥 Weight Loss</option>
                      <option value="muscle_gain">💪 Muscle Gain</option>
                      <option value="general_fitness">
                        🎯 General Fitness
                      </option>
                    </select>
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-cta w-full justify-center py-4 text-base disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Book My Free Trial →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
