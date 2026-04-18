import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" }).then(r => r.json()).then(d => { if (d.authenticated) navigate("/admin"); });
    fetch("/api/auth/setup", { method: "POST", headers: { "Content-Type": "application/json" } });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) navigate("/admin");
      else setError(data.error || "Invalid credentials");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8FF00]/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#E8FF00] rounded-sm flex items-center justify-center">
              <span className="text-[#080808] font-black text-xs">FZ</span>
            </div>
            <span className="display-upright text-white text-2xl tracking-wide">FitZone</span>
          </div>
          <div className="text-[#444] text-xs uppercase tracking-[0.2em]">Admin Panel</div>
        </div>

        <div className="surface rounded-2xl p-8">
          <div className="mb-6">
            <div className="display-upright text-2xl text-white mb-1">Welcome Back</div>
            <div className="text-[#444] text-xs">Sign in to manage your gym</div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#555] text-[10px] uppercase tracking-widest font-semibold mb-2">Username</label>
              <input type="text" placeholder="admin" value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="field" autoComplete="username" />
            </div>
            <div>
              <label className="block text-[#555] text-[10px] uppercase tracking-widest font-semibold mb-2">Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="field" autoComplete="current-password" />
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/15 px-3 py-2.5 rounded-lg">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-cta w-full justify-center py-3.5 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="mt-5 px-3 py-3 bg-[#E8FF00]/[0.04] border border-[#E8FF00]/10 rounded-lg">
            <p className="text-[#444] text-[10px] text-center">
              Default: <span className="text-[#888]">admin</span> / <span className="text-[#888]">admin123</span>
            </p>
          </div>
        </div>

        <a href="/" className="block text-center text-[#333] hover:text-[#666] text-xs mt-6 transition-colors">
          ← Back to website
        </a>
      </div>
    </div>
  );
}
