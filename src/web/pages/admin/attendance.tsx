import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface AttendanceRecord {
  id: number;
  date: string;
  markedAt: string;
  memberId: number;
  memberName: string;
  memberPhone: string;
  memberPlan: string;
}

interface Member {
  id: number;
  name: string;
  phone: string;
  plan: string;
}

export default function AdminAttendance() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [markPhone, setMarkPhone] = useState("");
  const [marking, setMarking] = useState(false);
  const [markMsg, setMarkMsg] = useState("");
  const [markError, setMarkError] = useState("");

  const load = (d: string) => {
    setLoading(true);
    fetch(`/api/attendance?date=${d}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(date);
    fetch("/api/members", { credentials: "include" }).then((r) => r.json()).then(setMembers);
  }, []);

  const markByPhone = async () => {
    if (!markPhone) return;
    setMarking(true);
    setMarkMsg("");
    setMarkError("");
    const res = await fetch("/api/attendance/mark", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: markPhone }),
    });
    const data = await res.json();
    if (res.ok) {
      setMarkMsg(`✅ Marked for ${data.member.name}`);
      setMarkPhone("");
      load(today);
    } else {
      setMarkError(data.error || "Error");
    }
    setMarking(false);
  };

  const markByAdmin = async (memberId: number) => {
    const res = await fetch("/api/attendance/admin-mark", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, date }),
    });
    if (res.ok) { load(date); }
  };

  const planColors: Record<string, string> = { basic: "#666", standard: "#FF6B35", premium: "#FFa500" };

  // Members not yet marked today
  const markedIds = new Set(records.map((r) => r.memberId));
  const unmarked = members.filter((m) => !markedIds.has(m.id));

  return (
    <AdminLayout title="ATTENDANCE">
      <div className="space-y-6">
        {/* Manual mark by phone */}
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-5">
          <h2 className="font-display text-lg text-white mb-4">MARK BY PHONE</h2>
          <div className="flex gap-3">
            <input
              type="tel"
              placeholder="Enter member phone number..."
              value={markPhone}
              onChange={(e) => setMarkPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onKeyDown={(e) => e.key === "Enter" && markByPhone()}
              className="field flex-1"
            />
            <button onClick={markByPhone} disabled={marking} className="btn-cta py-2 px-5 text-sm disabled:opacity-60">
              {marking ? "Marking..." : "Mark Present"}
            </button>
          </div>
          {markMsg && <div className="text-[#22c55e] text-sm mt-2">{markMsg}</div>}
          {markError && <div className="text-red-400 text-sm mt-2">❌ {markError}</div>}
        </div>

        {/* Date selector + today's attendance */}
        <div className="bg-[#111] border border-white/[0.06] rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <h2 className="font-display text-lg text-white">ATTENDANCE LOG</h2>
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); load(e.target.value); }}
                className="field w-44"
              />
              <div className="text-gray-400 text-sm font-semibold">{records.length} present</div>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-500 text-center py-12">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No attendance recorded for this date</div>
          ) : (
            <div className="space-y-2">
              {records.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#22c55e]/10 rounded-full flex items-center justify-center text-[#22c55e] text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{r.memberName}</div>
                      <div className="text-gray-500 text-xs">{r.memberPhone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded" style={{ color: planColors[r.memberPlan], background: `${planColors[r.memberPlan]}15` }}>
                      {r.memberPlan}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {new Date(r.markedAt).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Not yet marked (today only) */}
        {date === today && unmarked.length > 0 && (
          <div className="bg-[#111] border border-white/[0.06] rounded-lg p-5">
            <h2 className="font-display text-lg text-white mb-4">NOT YET MARKED TODAY ({unmarked.length})</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {unmarked.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-gray-300 text-sm">{m.name}</div>
                    <div className="text-gray-600 text-xs">{m.phone}</div>
                  </div>
                  <button onClick={() => markByAdmin(m.id)} className="text-xs px-3 py-1.5 bg-[#FF4500]/10 border border-[#FF4500]/20 text-[#FF4500] rounded hover:bg-[#FF4500]/20 transition-colors">
                    Mark Present
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
