export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#E8FF00] rounded-sm flex items-center justify-center">
            <span className="text-[#080808] font-black text-[9px]">FZ</span>
          </div>
          <span className="display-upright text-white text-lg tracking-wide">FitZone</span>
        </div>

        <p className="text-[#444] text-xs">© {new Date().getFullYear()} FitZone Gym. All rights reserved.</p>

        <div className="flex items-center gap-5">
          <a href="/member" className="text-[#555] hover:text-[#E8FF00] text-xs transition-colors">Member Portal</a>
          <a href="/admin/login" className="text-[#555] hover:text-[#E8FF00] text-xs transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
}
