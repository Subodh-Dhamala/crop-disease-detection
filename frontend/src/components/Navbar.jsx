import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-4">
              {/* Hamburger - Mobile Only */}
              <button
                onClick={toggleSidebar}
                className="md:hidden text-white hover:text-emerald-400 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <h1
                className="text-2xl font-bold text-white cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => navigate("/dashboard")}
              >
                GreenBidu
              </h1>
            </div>

            {/* Right: User info */}
            <div className="flex items-center gap-4">
              <p className="hidden md:block text-white font-semibold">
                Hello, {user?.username || 'User'}!
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-[73px] bottom-0 w-64 bg-[#0d140d] border-r border-white/10 z-50 md:hidden">
            <div className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/upload');
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-all"
                >
                  Upload Image
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;