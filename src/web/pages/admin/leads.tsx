import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

interface Lead {
  id: number;
  name: string;
  phone: string;
  goal: string;
  status: string;
  notes: string;
  createdAt: string;
}

const statusOptions = ["new", "contacted", "converted", "lost"];
const statusColors: Record<string, { color: string; bg: string }> = {
  new: { color: "#3b82f6", bg: "#3b82f610" },
  contacted: { color: "#f59e0b", bg: "#f59e0b10" },
  converted: { color: "#22c55e", bg: "#22c55e10" },
  lost: { color: "#666", bg: "#66666610" },
};
const goalLabels: Record<string, string> = {
  weight_loss: "🔥 Weight Loss",
  muscle_gain: "💪 Muscle Gain",
  general_fitness: "🎯 General Fitness",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = () => {
    fetch("/api/leads", { credentials: "include" })
      .then((r) => r.json())
      .then(setLeads)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const saveNotes = async () => {
    if (!editLead) return;
    await fetch(`/api/leads/${editLead.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: editLead.notes }),
    });
    setEditLead(null);
    load();
  };

  const deleteLead = async (id: number) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE", credentials: "include" });
    setDeleteConfirm(null);
    load();
  };

  const exportCSV = () => {
    const rows = [["ID", "Name", "Phone", "Goal", "Status", "Notes", "Created At"]];
    leads.forEach((l) => rows.push([String(l.id), l.name, l.phone, l.goal, l.status, l.notes || "", l.createdAt]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
  };

  const counts = statusOptions.reduce((acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }), {} as Record<string, number>);

  return (
    <AdminLayout title="LEADS">
      <div className="space-y-4">
        {/* Status count pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStatus("all")} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterStatus === "all" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            All ({leads.length})
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filterStatus === s ? "" : "opacity-60 hover:opacity-100"}`}
              style={filterStatus === s
                ? { color: statusColors[s].color, background: statusColors[s].bg, border: `1px solid ${statusColors[s].color}40` }
                : { color: statusColors[s].color }}
            >
              {s} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {/* Search + export */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field flex-1"
          />
          <button onClick={exportCSV} className="px-4 py-2 bg-[#1a1a1a] border border-white/10 text-gray-300 rounded text-sm hover:border-white/20 transition-colors whitespace-nowrap">
            📥 Export CSV
          </button>
        </div>

        {/* Leads list */}
        {loading ? (
          <div className="text-gray-500 text-center py-16">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No leads found</div>
        ) : (
          <div className="bg-[#111] border border-white/[0.06] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Lead</th>
                    <th className="px-5 py-3 text-left">Goal</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-white">{l.name}</div>
                        <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noreferrer" className="text-[#25D366] text-xs hover:underline">
                          💬 {l.phone}
                        </a>
                        {l.notes && <div className="text-gray-600 text-xs mt-0.5 max-w-xs truncate">{l.notes}</div>}
                      </td>
                      <td className="px-5 py-3.5 text-gray-300 text-xs">{goalLabels[l.goal] || l.goal}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={l.status}
                          onChange={(e) => updateStatus(l.id, e.target.value)}
                          className="text-xs font-semibold uppercase px-2 py-1 rounded border-0 cursor-pointer focus:outline-none"
                          style={{ color: statusColors[l.status]?.color, background: statusColors[l.status]?.bg }}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s} style={{ background: "#111", color: "#fff" }}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 text-xs">
                        {new Date(l.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => setEditLead(l)} className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors">
                            Notes
                          </button>
                          <button onClick={() => setDeleteConfirm(l.id)} className="text-gray-400 hover:text-red-400 text-xs px-2 py-1 bg-white/5 rounded hover:bg-red-500/10 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Notes modal */}
      {editLead && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 w-full max-w-md">
            <h3 className="font-display text-xl text-white mb-1">NOTES</h3>
            <p className="text-gray-500 text-sm mb-4">{editLead.name} · {editLead.phone}</p>
            <textarea
              value={editLead.notes || ""}
              onChange={(e) => setEditLead({ ...editLead, notes: e.target.value })}
              className="field h-32 resize-none"
              placeholder="Add notes about this lead..."
            />
            <div className="flex gap-3 mt-4">
              <button onClick={saveNotes} className="btn-cta flex-1 py-2.5 text-sm">Save</button>
              <button onClick={() => setEditLead(null)} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/[0.08] rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-white mb-2">DELETE LEAD?</h3>
            <p className="text-gray-400 text-sm mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteLead(deleteConfirm)} className="flex-1 py-2.5 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-white/10 text-gray-400 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
