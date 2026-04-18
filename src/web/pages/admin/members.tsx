import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Member {
  id: number;
  name: string;
  phone: string;
  email: string;
  plan: string;
  status: string;
  joinDate: string;
  expiryDate: string;
  createdAt: string;
}

const emptyForm = {
  name: "", phone: "", email: "", plan: "basic",
  joinDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
};

function daysUntil(date: string) {
  if (!date) return null;
  const diff = new Date(date).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = () => {
    fetch("/api/members", { credentials: "include" })
      .then((r) => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search);
    const matchStatus = filterStatus === "all" || m.status === filterStatus ||
      (filterStatus === "expiring" && daysUntil(m.expiryDate) !== null && daysUntil(m.expiryDate)! <= 7 && daysUntil(m.expiryDate)! >= 0);
    return matchSearch && matchStatus;
  });

  const save = async () => {
    setSaving(true);
    const url = editId ? `/api/members/${editId}` : "/api/members";
    const method = editId ? "PATCH" : "POST";
    await fetch(url, {
      method, credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...emptyForm });
    load();
  };

  const deleteMember = async (id: number) => {
    await fetch(`/api/members/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteConfirm(null);
    load();
  };

  const startEdit = (m: Member) => {
    setForm({ name: m.name, phone: m.phone, email: m.email || "", plan: m.plan, joinDate: m.joinDate, expiryDate: m.expiryDate });
    setEditId(m.id);
    setShowForm(true);
  };

  const exportCSV = () => {
    const rows = [["ID", "Name", "Phone", "Email", "Plan", "Status", "Join Date", "Expiry Date"]];
    members.forEach((m) => rows.push([String(m.id), m.name, m.phone, m.email || "", m.plan, m.status, m.joinDate, m.expiryDate]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "members.csv"; a.click();
  };

  const planColors: Record<string, string> = { basic: "#666", standard: "#FF6B35", premium: "#FFa500" };
  const statusColors: Record<string, string> = { active: "#22c55e", expired: "#ef4444", suspended: "#f59e0b" };

  return (
    <AdminLayout title="MEMBERS">
      <div className="space-y-4">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field flex-1"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="field w-40">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon</option>
          </select>
          <button onClick={exportCSV} className="px-4 py-2 bg-[#1a1a1a] border border-white/10 text-gray-300 rounded text-sm hover:border-white/20 transition-colors whitespace-nowrap">
            📥 Export CSV
          </button>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyForm }); }} className="btn-cta py-2 px-5 text-sm whitespace-nowrap">
            + Add Member
          </button>
        </div>

        {/* Count */}
        <div className="text-gray-500 text-sm">{filtered.length} member{filtered.length !== 1 ? "s" : ""}</div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-500 text-center py-16">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No members found</div>
        ) : (
          <div className="bg-[#111] border border-white/[0.06] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Phone</th>
                    <th className="px-5 py-3 text-left">Plan</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Expiry</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => {
                    const days = daysUntil(m.expiryDate);
                    return (
                      <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-white">{m.name}</div>
                          <div className="text-gray-600 text-xs">{m.email}</div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-300">{m.phone}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded" style={{ color: planColors[m.plan], background: `${planColors[m.plan]}15` }}>
                            {m.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold uppercase px-2 py-1 rounded" style={{ color: statusColors[m.status], background: `${statusColors[m.status]}15` }}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-gray-300 text-xs">{m.expiryDate}</div>
                          {days !== null && days <= 7 && days >= 0 && (
                            <div className="text-[#ef4444] text-xs font-semibold mt-0.5">⚠️ {days}d left</div>
                          )}
                          {days !== null && days < 0 && (
                            <div className="text-red-500 text-xs font-semibold mt-0.5">Expired {Math.abs(days)}d ago</div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(m)} className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors">
                              Edit
                            </button>
                            <button onClick={() => setDeleteConfirm(m.id)} className="text-gray-400 hover:text-red-400 text-xs px-2 py-1 bg-white/5 rounded hover:bg-red-500/10 transition-colors">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-2xl text-white mb-6">{editId ? "EDIT MEMBER" : "ADD MEMBER"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Member name" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Phone *</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="10-digit phone" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="Email (optional)" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Plan *</label>
                <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="field">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Join Date</label>
                  <input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} className="field" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Expiry Date *</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="field" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="btn-cta flex-1 py-2.5 text-sm disabled:opacity-60">
                {saving ? "Saving..." : editId ? "Update Member" : "Add Member"}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded text-sm hover:border-white/20">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-white mb-2">DELETE MEMBER?</h3>
            <p className="text-gray-400 text-sm mb-6">This will also delete their attendance history. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteMember(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
