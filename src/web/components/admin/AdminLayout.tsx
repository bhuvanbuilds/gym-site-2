import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";

interface Props { children: React.ReactNode; title?: string; }

const NavIcon = ({ path }: { path: string }) => {
  const icons: Record<string, JSX.Element> = {
    "/admin": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    "/admin/members": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M12 7v4M14 9h-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    "/admin/attendance": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M5.5 10.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "/admin/leads": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return icons[path] || null;
};

export default function AdminLayout({ children, title }: Props) {
  const [location, navigate] = useLocation();
  const { username, logout, authenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E8FF00]/20 border-t-[#E8FF00] rounded-full animate-spin" />
          <div className="text-[#555] text-sm">Loading...</div>
        </div>
      </div>
    );
  }
  if (authenticated === false) { window.location.href = "/admin/login"; return null; }

  const navItems = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/members", label: "Members" },
    { path: "/admin/attendance", label: "Attendance" },
    { path: "/admin/leads", label: "Leads" },
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#0c0c0c] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E8FF00] rounded-sm flex items-center justify-center">
              <span className="text-[#080808] font-black text-[9px]">FZ</span>
            </div>
            <span className="display-upright text-white text-base tracking-wide">FitZone</span>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <div className="text-[#333] text-[10px] uppercase tracking-[0.2em] font-semibold">Navigation</div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = location === item.path;
            return (
              <button key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? "nav-active" : "text-[#555] hover:text-[#aaa] hover:bg-white/[0.03]"
                }`}>
                <span className={active ? "text-[#E8FF00]" : ""}><NavIcon path={item.path} /></span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-1">
            <div className="w-8 h-8 bg-[#E8FF00]/10 rounded-lg flex items-center justify-center text-[#E8FF00] text-xs font-bold flex-shrink-0">
              {username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{username}</div>
              <div className="text-[#444] text-[10px]">Administrator</div>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[#444] hover:text-red-400 text-xs transition-colors rounded-lg hover:bg-red-500/5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 13H2a1 1 0 01-1-1V2a1 1 0 011-1h3M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sign Out
          </button>
          <a href="/" className="flex items-center gap-2.5 px-3 py-2 text-[#333] hover:text-[#666] text-xs transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 4.5c-1.5 0-2.5 1-2.5 2.5S5.5 9.5 7 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M4.5 7h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            View Website
          </a>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur border-b border-white/[0.06] px-6 h-16 flex items-center gap-4">
          <button className="md:hidden text-[#555] hover:text-white p-1 transition-colors"
            onClick={() => setSidebarOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {title && <span className="display-upright text-white text-lg">{title}</span>}
          <div className="ml-auto text-[#444] text-xs">{new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
