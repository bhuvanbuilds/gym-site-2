import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Stats {
  totalMembers: number; activeMembers: number; expiredMembers: number;
  totalLeads: number; newLeads: number; todayAttendance: number;
  expiringMembers: number; attendanceTrend: { date: string; count: number }[];
}

const StatCard = ({ label, value, sub, colorClass, icon }: {
  label: string; value: number; sub?: string; colorClass: string; icon: string;
}) => (
  <div className={`surface ${colorClass} rounded-xl p-5`}>
    <div className="flex items-start justify-between mb-4">
      <span className="text-xl">{icon}</span>
      <div className="w-2 h-2 rounded-full bg-current opacity-40" />
    </div>
    <div className="display-upright text-4xl text-white mb-1">{value}</div>
    <div className="text-[#555] text-xs font-medium">{label}</div>
    {sub && <div className="text-[#444] text-[10px] mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats", { credentials: "include" }).then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  const maxTrend = stats ? Math.max(...stats.attendanceTrend.map(t => t.count), 1) : 1;

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-[#E8FF00]/20 border-t-[#E8FF00] rounded-full animate-spin" />
        </div>
      ) : stats && (
        <div className="space-y-5 max-w-5xl">

          {/* Expiry alert */}
          {stats.expiringMembers > 0 && (
            <div className="surface border-l-2 border-l-amber-400 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-base">⚠️</span>
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-semibold">
                  {stats.expiringMembers} member{stats.expiringMembers > 1 ? "s" : ""} expiring this week
                </div>
                <div className="text-[#555] text-xs mt-0.5">Contact them to renew before their access ends.</div>
              </div>
              <a href="/admin/members" className="text-[#E8FF00] text-xs font-semibold hover:underline whitespace-nowrap">View →</a>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Total Members" value={stats.totalMembers} icon="◉" colorClass="stat-card-orange" />
            <StatCard label="Active Members" value={stats.activeMembers} icon="▲" colorClass="stat-card-green" />
            <StatCard label="Today's Attendance" value={stats.todayAttendance} icon="◈" colorClass="stat-card-blue" sub="check-ins today" />
            <StatCard label="New Leads" value={stats.newLeads} icon="◆" colorClass="stat-card-yellow" sub={`of ${stats.totalLeads} total`} />
            <StatCard label="Expiring Soon" value={stats.expiringMembers} icon="◐" colorClass="stat-card-red" sub="within 7 days" />
            <StatCard label="Expired" value={stats.expiredMembers} icon="◻" colorClass="stat-card-purple" />
          </div>

          {/* Attendance chart */}
          <div className="surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Attendance</div>
                <div className="display-upright text-lg text-white">7-Day Trend</div>
              </div>
              <div className="text-[#333] text-xs">{stats.todayAttendance} today</div>
            </div>
            <div className="flex items-end gap-2 h-28">
              {stats.attendanceTrend.map((day) => {
                const h = maxTrend > 0 ? Math.max((day.count / maxTrend) * 100, 3) : 3;
                const isToday = day.date === new Date().toISOString().slice(0, 10);
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-[#444] text-[10px]">{day.count || ""}</div>
                    <div className="w-full rounded-t-sm transition-all duration-500 group relative"
                      style={{ height: `${h}%`, background: isToday ? "#E8FF00" : "#1f1f1f", minHeight: "3px" }}>
                      {isToday && <div className="absolute inset-0 bg-[#E8FF00]/20 blur-sm rounded-t-sm" />}
                    </div>
                    <div className={`text-[10px] ${isToday ? "text-[#E8FF00] font-semibold" : "text-[#333]"}`}>
                      {new Date(day.date + "T00:00:00").toLocaleDateString("en", { weekday: "short" })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "➕", label: "Add Member", href: "/admin/members", color: "#E8FF00" },
              { icon: "✅", label: "Mark Attendance", href: "/admin/attendance", color: "#22c55e" },
              { icon: "🎯", label: "View Leads", href: "/admin/leads", color: "#60a5fa" },
              { icon: "📥", label: "Export Data", href: "/admin/members", color: "#a78bfa" },
            ].map((a) => (
              <a key={a.label} href={a.href}
                className="surface rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-1 hover:border-white/10 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${a.color}0f` }}>
                  {a.icon}
                </div>
                <span className="text-[#666] group-hover:text-[#aaa] text-xs font-medium transition-colors">{a.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
