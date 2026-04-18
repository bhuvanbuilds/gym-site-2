import { useState } from "react";

interface Member { id: number; name: string; phone: string; plan: string; status: string; joinDate: string; expiryDate: string; }
interface AttRecord { id: number; date: string; markedAt: string; }
interface HistoryData { member: Member; attendance: AttRecord[]; }

function daysUntil(date: string) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - new Date().getTime()) / 86400000);
}
function getStreak(records: AttRecord[]) {
  if (!records.length) return 0;
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let cur = new Date().toISOString().slice(0, 10);
  for (const r of sorted) {
    if (r.date === cur) { streak++; const d = new Date(cur); d.setDate(d.getDate() - 1); cur = d.toISOString().slice(0, 10); }
    else break;
  }
  return streak;
}

const planColors: Record<string, string> = { basic: "#777", standard: "#E8FF00", premium: "#FFa500" };

export default function MemberPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState("");
  const [markMsg, setMarkMsg] = useState("");
  const [markError, setMarkError] = useState("");
  const [view, setView] = useState<"status" | "history">("status");

  const today = new Date().toISOString().slice(0, 10);
  const alreadyToday = data?.attendance.some(r => r.date === today);

  const lookup = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { setError("Enter a valid 10-digit mobile number"); return; }
    setLoading(true); setError(""); setMarkMsg(""); setMarkError("");
    const res = await fetch(`/api/attendance/history?phone=${phone}`);
    const json = await res.json();
    if (res.ok) setData(json); else setError(json.error || "Member not found");
    setLoading(false);
  };

  const mark = async () => {
    if (!data) return;
    setMarking(true); setMarkMsg(""); setMarkError("");
    const res = await fetch("/api/attendance/mark", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: data.member.phone }),
    });
    const json = await res.json();
    if (res.ok) {
      setMarkMsg("Attendance marked!");
      const up = await fetch(`/api/attendance/history?phone=${data.member.phone}`);
      if (up.ok) setData(await up.json());
    } else setMarkError(json.error || "Error");
    setMarking(false);
  };

  const streak = data ? getStreak(data.attendance) : 0;
  const daysLeft = data ? daysUntil(data.member.expiryDate) : null;
  const grouped = data
    ? data.attendance.reduce((a, r) => { const m = r.date.slice(0, 7); if (!a[m]) a[m] = []; a[m].push(r); return a; }, {} as Record<string, AttRecord[]>)
    : {};

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0c0c0c] px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#E8FF00] rounded-sm flex items-center justify-center">
            <span className="text-[#080808] font-black text-[9px]">FZ</span>
          </div>
          <span className="display-upright text-white text-base tracking-wide">FitZone</span>
        </a>
        <span className="text-[#444] text-xs uppercase tracking-widest">Member Portal</span>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">

        {/* Lookup form */}
        {!data && (
          <div>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-[#E8FF00]/[0.06] border border-[#E8FF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
                🏋️
              </div>
              <div className="display-upright text-3xl text-white mb-2">Member Portal</div>
              <p className="text-[#555] text-sm">Enter your registered phone number to access your membership.</p>
            </div>

            <div className="surface rounded-2xl p-6">
              <label className="block text-[#555] text-[10px] uppercase tracking-widest font-semibold mb-2">Phone Number</label>
              <div className="flex gap-2 mb-3">
                <div className="field w-14 flex-shrink-0 text-center text-[#555] text-sm">+91</div>
                <input type="tel" placeholder="9876543210" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onKeyDown={e => e.key === "Enter" && lookup()}
                  className="field flex-1" maxLength={10} />
              </div>
              {error && <div className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/15 px-3 py-2 rounded-lg">{error}</div>}
              <button onClick={lookup} disabled={loading} className="btn-cta w-full justify-center py-3.5 disabled:opacity-50">
                {loading ? "Looking up..." : "Access My Membership →"}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard */}
        {data && (
          <div className="space-y-4">

            {/* Member card */}
            <div className="surface rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="display-upright text-2xl text-white">{data.member.name}</div>
                  <div className="text-[#555] text-xs mt-0.5">{data.member.phone}</div>
                </div>
                <button onClick={() => { setData(null); setPhone(""); setMarkMsg(""); setMarkError(""); }}
                  className="text-[#333] hover:text-[#666] text-xs transition-colors">Sign out</button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: planColors[data.member.plan], background: `${planColors[data.member.plan]}12`, border: `1px solid ${planColors[data.member.plan]}25` }}>
                  {data.member.plan} plan
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  data.member.status === "active" ? "text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20" : "text-red-400 bg-red-500/10 border border-red-500/20"
                }`}>
                  {data.member.status}
                </span>
              </div>

              {/* Expiry bar */}
              {daysLeft !== null && (
                <div className={`rounded-xl px-4 py-3 text-sm ${
                  daysLeft < 0 ? "bg-red-500/10 border border-red-500/15 text-red-400"
                  : daysLeft <= 7 ? "bg-amber-500/10 border border-amber-400/20 text-amber-400"
                  : "bg-[#E8FF00]/5 border border-[#E8FF00]/10 text-[#E8FF00]"
                }`}>
                  <div className="font-semibold text-xs">
                    {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago`
                      : daysLeft === 0 ? "Expires today!"
                      : daysLeft <= 7 ? `Expires in ${daysLeft} days`
                      : `${daysLeft} days remaining`}
                  </div>
                  <div className="text-current/50 text-[10px] mt-0.5 opacity-60">Expiry: {data.member.expiryDate}</div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total Visits", value: data.attendance.length },
                { label: "This Month", value: data.attendance.filter(r => r.date.startsWith(today.slice(0, 7))).length },
                { label: "🔥 Streak", value: `${streak}d` },
              ].map(s => (
                <div key={s.label} className="surface rounded-xl p-4 text-center">
                  <div className="display-upright text-3xl text-white mb-1">{s.value}</div>
                  <div className="text-[#444] text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Attendance mark */}
            {data.member.status === "active" && (daysLeft === null || daysLeft >= 0) && (
              <div className="surface rounded-2xl p-5">
                <div className="text-[#555] text-[10px] uppercase tracking-widest mb-3">Today's Attendance</div>
                {alreadyToday ? (
                  <div className="flex items-center gap-3 bg-[#22c55e]/[0.06] border border-[#22c55e]/15 rounded-xl px-4 py-4">
                    <div className="w-9 h-9 bg-[#22c55e]/15 rounded-lg flex items-center justify-center text-[#22c55e] flex-shrink-0">✓</div>
                    <div>
                      <div className="text-[#22c55e] font-semibold text-sm">Marked for today!</div>
                      <div className="text-[#444] text-xs mt-0.5">See you tomorrow</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={mark} disabled={marking}
                      className="btn-cta w-full justify-center py-4 text-base disabled:opacity-50">
                      {marking ? "Marking..." : "✅ Mark My Attendance →"}
                    </button>
                    {markMsg && <div className="text-[#22c55e] text-xs mt-2 text-center">{markMsg}</div>}
                    {markError && <div className="text-red-400 text-xs mt-2 text-center">{markError}</div>}
                  </>
                )}
              </div>
            )}

            {/* Toggle */}
            <div className="flex gap-1.5 p-1 bg-[#101010] border border-white/[0.06] rounded-xl">
              {(["status", "history"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    view === v ? "bg-[#E8FF00] text-[#080808]" : "text-[#555] hover:text-[#888]"
                  }`}>
                  {v === "status" ? "Membership" : "History"}
                </button>
              ))}
            </div>

            {/* Status tab */}
            {view === "status" && (
              <div className="surface rounded-2xl p-5 space-y-3">
                {[
                  ["Member", data.member.name],
                  ["Phone", data.member.phone],
                  ["Plan", data.member.plan.charAt(0).toUpperCase() + data.member.plan.slice(1)],
                  ["Status", data.member.status],
                  ["Joined", data.member.joinDate],
                  ["Expires", data.member.expiryDate],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-[#444] text-xs uppercase tracking-widest">{k}</span>
                    <span className="text-[#ccc] text-sm font-medium">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* History tab */}
            {view === "history" && (
              <div className="surface rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[#555] text-[10px] uppercase tracking-widest">Attendance History</div>
                  <span className="text-[#E8FF00] text-xs font-semibold">{data.attendance.length} visits</span>
                </div>
                {data.attendance.length === 0 ? (
                  <div className="text-[#333] text-sm text-center py-8">No attendance records yet</div>
                ) : (
                  <div className="space-y-5 max-h-96 overflow-y-auto pr-1">
                    {Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0])).map(([month, recs]) => (
                      <div key={month}>
                        <div className="text-[#333] text-[10px] uppercase tracking-widest mb-2 flex items-center justify-between sticky top-0 bg-[#101010] py-1">
                          <span>{new Date(month + "-01").toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
                          <span className="text-[#E8FF00]">{recs.length}×</span>
                        </div>
                        {recs.map(r => (
                          <div key={r.id} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                              <span className="text-[#aaa] text-sm">
                                {new Date(r.date + "T00:00:00").toLocaleDateString("en", { weekday: "short", day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <span className="text-[#333] text-xs">
                              {new Date(r.markedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
